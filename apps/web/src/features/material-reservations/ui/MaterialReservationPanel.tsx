import { useEffect, useState } from "react";
import {
  fetchMaterialLots,
  type MaterialLotListItem,
} from "@/entities/material-lot";
import {
  fetchMaterialReservations,
  releaseMaterialAllocation,
  reserveMaterial,
  type MaterialReservationView,
} from "../api/material-reservations";
import { ApiRequestError } from "@/shared/api";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
} from "@/shared/ui";

interface MaterialReservationPanelProps {
  workOrderId: string;
  orderNumber: string;
  csrfToken: string;
  canReserve: boolean;
  canRelease: boolean;
  isReleased: boolean;
}

async function fetchAvailableLots(signal: AbortSignal) {
  const lots: MaterialLotListItem[] = [];
  for (let page = 1; ; page += 1) {
    signal.throwIfAborted();
    const result = await fetchMaterialLots(
      new URLSearchParams({
        availability: "available",
        page: String(page),
        pageSize: "100",
      }),
      signal,
    );
    lots.push(...result.items);
    if (page * result.pageSize >= result.total) {
      return lots;
    }
  }
}

export function MaterialReservationPanel(props: MaterialReservationPanelProps) {
  return (
    <MaterialReservationForm
      key={`${props.workOrderId}:${props.canReserve}`}
      {...props}
    />
  );
}

function MaterialReservationForm({
  workOrderId,
  orderNumber,
  csrfToken,
  canReserve,
  canRelease,
  isReleased,
}: MaterialReservationPanelProps) {
  const [reservations, setReservations] = useState<MaterialReservationView[] | null>(
    null,
  );
  const [availableLots, setAvailableLots] = useState<MaterialLotListItem[]>([]);
  const [lotId, setLotId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [pending, setPending] = useState<"reserve" | `release:${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [readError, setReadError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.all([
      fetchMaterialReservations(workOrderId, controller.signal),
      canReserve ? fetchAvailableLots(controller.signal) : Promise.resolve([]),
    ])
      .then(([rows, lots]) => {
        if (!active) {
          return;
        }
        setReservations(rows);
        setAvailableLots(lots);
        setLotId((current) =>
          lots.some((lot) => lot.id === current) ? current : (lots[0]?.id ?? ""),
        );
      })
      .catch((cause: unknown) => {
        if (!active) {
          return;
        }
        controller.abort();
        setReadError(
          cause instanceof ApiRequestError
            ? cause.message
            : "예약 현황 또는 가용 재고를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [workOrderId, canReserve, reloadCount]);

  function reload() {
    setLoading(true);
    setReadError(null);
    setReloadCount((count) => count + 1);
  }

  const selectedLot = availableLots.find((lot) => lot.id === lotId);
  const maxQuantity = selectedLot?.availableQuantity ?? 0;
  const validQuantity =
    Number.isSafeInteger(Number(quantity)) &&
    Number(quantity) > 0 &&
    Number(quantity) <= maxQuantity;
  const unavailable = loading || readError !== null || pending !== null;

  async function runReserve() {
    if (
      !canReserve || !isReleased || !selectedLot || !validQuantity || unavailable
    ) {
      return;
    }
    setPending("reserve");
    setError(null);
    setNotice(null);
    try {
      const rows = await reserveMaterial(
        workOrderId,
        { materialLotId: lotId, quantity: Number(quantity) },
        csrfToken,
      );
      setReservations(rows);
      setNotice("자재를 예약했습니다.");
      reload();
    } catch (cause: unknown) {
      setError(
        cause instanceof ApiRequestError ? cause.message : "예약하지 못했습니다.",
      );
    } finally {
      setPending(null);
    }
  }

  async function runRelease(allocationId: string) {
    if (!canRelease || unavailable) {
      return;
    }
    setPending(`release:${allocationId}`);
    setError(null);
    setNotice(null);
    try {
      const rows = await releaseMaterialAllocation(allocationId, csrfToken);
      setReservations(rows);
      setNotice("자재 예약을 해제했습니다.");
      reload();
    } catch (cause: unknown) {
      setError(
        cause instanceof ApiRequestError ? cause.message : "해제하지 못했습니다.",
      );
    } finally {
      setPending(null);
    }
  }

  const activeCount =
    reservations?.filter((row) => row.status === "ACTIVE").length ?? 0;

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle>
          <h3>자재 예약</h3>
        </CardTitle>
        <CardDescription>
          {`${reservations === null ? "예약 현황 확인 필요" : `활성 예약 ${activeCount}건`} · 발행 상태에서만 예약할 수 있습니다 (${orderNumber}).`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-4">
        {loading ? (
          <p className="text-sm text-text-muted" role="status">
            예약 현황과 가용 재고를 확인하는 중입니다.
          </p>
        ) : null}
        {readError !== null ? (
          <div className="space-y-2 text-sm text-danger-strong" role="alert">
            <p>{readError}</p>
            <Button variant="secondary" onClick={reload}>
              다시 조회
            </Button>
          </div>
        ) : null}
        {reservations === null ? null : reservations.length === 0 ? (
          !loading && readError === null ? (
            <p className="text-sm text-text-muted" role="status">
              아직 예약된 자재가 없습니다.
            </p>
          ) : null
        ) : (
          <ul className="divide-y divide-border">
            {reservations.map((row) => (
              <li
                className="flex flex-wrap items-center justify-between gap-2 py-3"
                key={row.id}
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold">{row.lotNumber}</span>
                  <span className="text-sm">
                    {row.materialName} ({row.materialCode})
                  </span>
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    {row.quantity.toLocaleString("ko-KR")} {row.unit}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Badge tone={row.status === "ACTIVE" ? "info" : "neutral"}>
                    {row.status === "ACTIVE" ? "활성" : "종료"}
                  </Badge>
                  {row.status === "ACTIVE" && canRelease ? (
                    <Button
                      variant="secondary"
                      disabled={unavailable}
                      loading={pending === `release:${row.id}`}
                      onClick={() => void runRelease(row.id)}
                    >
                      해제
                    </Button>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}

        {canReserve ? (
          isReleased ? (
            <div className="rounded-panel border border-border bg-surface p-4">
              <p className="text-sm font-semibold">자재 LOT 예약</p>
              <p className="mt-1 text-xs text-text-muted">
                가용 자재 LOT만 선택할 수 있고 예약량은 가용 수량 안에서 검증됩니다.
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div className="min-w-64 flex-1">
                  <Select
                    label="자재 LOT"
                    disabled={unavailable || availableLots.length === 0}
                    placeholder={
                      loading
                        ? "재고 조회 중"
                        : readError !== null
                          ? "재고 확인 필요"
                          : "가용 자재가 없습니다"
                    }
                    options={availableLots.map((lot) => ({
                      label: `${lot.materialName} ${lot.lotNumber} (가용 ${lot.availableQuantity})`,
                      value: lot.id,
                    }))}
                    value={lotId}
                    onValueChange={setLotId}
                  />
                </div>
                <div className="w-28">
                  <Input
                    id="reserve-quantity"
                    label="수량"
                    min={1}
                    max={maxQuantity}
                    step={1}
                    disabled={unavailable || !selectedLot}
                    name="reserveQuantity"
                    onChange={(event) => setQuantity(event.target.value)}
                    type="number"
                    value={quantity}
                  />
                </div>
                <Button
                  disabled={!selectedLot || !validQuantity || unavailable}
                  loading={pending === "reserve"}
                  onClick={() => void runReserve()}
                >
                  예약
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-muted">
              발행 상태가 아니면 예약할 수 없습니다. 현재 상태를 확인해 주세요.
            </p>
          )
        ) : (
          <p className="text-xs text-text-muted">
            예약·해제는 자재 담당자만 할 수 있습니다. 현재 역할로는 예약 현황을
            조회할 수 있습니다.
          </p>
        )}

        {notice !== null ? (
          <p className="text-sm text-text" role="status">
            {notice}
          </p>
        ) : null}
        {error !== null ? (
          <p
            className="rounded-panel border border-danger/40 bg-danger-soft/40 px-4 py-3 text-sm text-danger-strong"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
