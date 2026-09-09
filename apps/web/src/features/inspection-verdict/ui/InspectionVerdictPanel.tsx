import { useEffect, useRef, useState } from "react";
import { verdictInspection } from "../api/inspection-verdict";
import { ApiRequestError } from "@/shared/api";
import { Badge, Button, Input, Select } from "@/shared/ui";

export interface InspectionVerdictTarget {
  inspectionId: string;
  inspectionNumber: string;
  specName: string;
  productionLotNumber: string;
}

interface InspectionVerdictPanelProps {
  target: InspectionVerdictTarget;
  csrfToken: string;
  onDone: () => void;
}

const VERDICT_OPTIONS = [
  { label: "합격 (PASS)", value: "PASS" },
  { label: "불합격 (FAIL)", value: "FAIL" },
  { label: "보류 (HOLD)", value: "HOLD" },
] as const;

export function InspectionVerdictPanel(props: InspectionVerdictPanelProps) {
  return <InspectionVerdictForm key={props.target.inspectionId} {...props} />;
}

function InspectionVerdictForm({
  target,
  csrfToken,
  onDone,
}: InspectionVerdictPanelProps) {
  const [verdict, setVerdict] = useState("");
  const [memo, setMemo] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  async function submit() {
    if (
      pending || (verdict !== "PASS" && verdict !== "FAIL" && verdict !== "HOLD")
    ) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      await verdictInspection(
        target.inspectionId,
        {
          verdict,
          ...(memo.trim() === "" ? {} : { memo: memo.trim() }),
        },
        csrfToken,
      );
      if (active.current) {
        onDone();
      }
    } catch (cause: unknown) {
      if (!active.current) {
        return;
      }
      setError(
        cause instanceof ApiRequestError
          ? cause.message
          : "판정을 처리하지 못했습니다.",
      );
      setPending(false);
    }
  }

  return (
    <div className="rounded-panel border border-border bg-surface p-4" aria-label="검사 판정 입력">
      <p className="text-sm font-semibold">
        {`${target.inspectionNumber} · ${target.specName} (${target.productionLotNumber})`}
      </p>
      <p className="mt-1 text-xs text-text-muted">
        판정 확정 시 감사 이력에 기록되며 불합격·보류는 다음 공정 진행을 차단합니다.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="min-w-44">
          <Select
            label="판정"
            placeholder="판정을 선택해 주세요"
            disabled={pending}
            options={VERDICT_OPTIONS.map((option) => ({ ...option }))}
            value={verdict}
            onValueChange={setVerdict}
          />
        </div>
        <div className="min-w-56 flex-1">
          <Input
            disabled={pending}
            hint="선택 사항입니다."
            id="verdict-memo"
            label="판정 메모"
            name="verdictMemo"
            onChange={(event) => setMemo(event.target.value)}
            value={memo}
          />
        </div>
        <Button
          disabled={verdict === ""}
          loading={pending}
          onClick={() => void submit()}
        >
          판정 확정
        </Button>
        <Button variant="ghost" disabled={pending} onClick={onDone}>
          취소
        </Button>
      </div>
      {verdict !== "" && verdict !== "PASS" ? (
        <p className="mt-3">
          <Badge tone={verdict === "FAIL" ? "danger" : "warning"}>
            {verdict === "FAIL"
              ? "불합격은 품질 처분 대상이 됩니다"
              : "보류는 재측정 전까지 진행을 막습니다"}
          </Badge>
        </p>
      ) : null}
      {error !== null ? (
        <p className="mt-3 rounded-panel border border-danger/40 bg-danger-soft/40 px-4 py-3 text-sm text-danger-strong">
          {error}
        </p>
      ) : null}
    </div>
  );
}
