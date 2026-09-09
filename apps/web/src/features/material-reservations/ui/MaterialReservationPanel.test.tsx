import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMaterialLots, type MaterialLotListItem } from "@/entities/material-lot";
import {
  fetchMaterialReservations,
  releaseMaterialAllocation,
  reserveMaterial,
} from "../api/material-reservations";
import { MaterialReservationPanel } from "./MaterialReservationPanel";

vi.mock("@/entities/material-lot", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/material-lot")>();
  return { ...actual, fetchMaterialLots: vi.fn() };
});

vi.mock("../api/material-reservations", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/material-reservations")>();
  return {
    ...actual,
    fetchMaterialReservations: vi.fn(),
    reserveMaterial: vi.fn(),
    releaseMaterialAllocation: vi.fn(),
  };
});

const reservationsMock = vi.mocked(fetchMaterialReservations);
const lotsMock = vi.mocked(fetchMaterialLots);
const reserveMock = vi.mocked(reserveMaterial);
const releaseMock = vi.mocked(releaseMaterialAllocation);

const availableLot: MaterialLotListItem = {
  id: "lot-1",
  lotNumber: "ML-2026-0301",
  materialCode: "SEN-MAT-014",
  materialName: "적외선 감지 다이오드 어레이",
  unit: "EA",
  receivedQuantity: 200,
  onHand: 200,
  reservedQuantity: 0,
  consumedQuantity: 0,
  scrappedQuantity: 0,
  availableQuantity: 200,
  qualityDisposition: "ACCEPTED",
  expiresAt: null,
  receivedAt: "2026-08-14T00:00:00.000Z",
};

const availablePage = { items: [availableLot], page: 1, pageSize: 100, total: 1 };

function renderPanel(overrides: { canReserve?: boolean; canRelease?: boolean } = {}) {
  render(
    <MaterialReservationPanel
      workOrderId="wo-1"
      orderNumber="WO-2026-092"
      csrfToken="csrf"
      canReserve={overrides.canReserve ?? true}
      canRelease={overrides.canRelease ?? true}
      isReleased
    />,
  );
}

describe("MaterialReservationPanel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("활성 예약과 해제 행동을 표시한다", async () => {
    reservationsMock.mockResolvedValue([
      {
        id: "alloc-1",
        lotNumber: "ML-2026-0301",
        materialCode: "SEN-MAT-014",
        materialName: "적외선 감지 다이오드 어레이",
        unit: "EA",
        quantity: 50,
        status: "ACTIVE",
        closedReason: null,
        createdAt: "2026-09-03T01:00:00.000Z",
      },
    ]);
    lotsMock.mockResolvedValue({ items: [], page: 1, pageSize: 20, total: 0 });
    renderPanel();

    expect(await screen.findByText("ML-2026-0301")).toBeInTheDocument();
    expect(screen.getByText("활성")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "해제" })).toBeInTheDocument();
  });

  it("예약 폼에서 가용 LOT과 수량을 검증해 전송한다", async () => {
    reservationsMock.mockResolvedValue([]);
    lotsMock.mockResolvedValue({
      items: [
        {
          id: "lot-1",
          lotNumber: "ML-2026-0301",
          materialCode: "SEN-MAT-014",
          materialName: "적외선 감지 다이오드 어레이",
          unit: "EA",
          receivedQuantity: 500,
          onHand: 320,
          reservedQuantity: 120,
          consumedQuantity: 180,
          scrappedQuantity: 0,
          availableQuantity: 200,
          qualityDisposition: "ACCEPTED",
          expiresAt: null,
          receivedAt: "2026-08-14T00:00:00.000Z",
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
    });
    reserveMock.mockResolvedValue([]);
    renderPanel();

    await screen.findByText(/적외선 감지 다이오드 어레이 ML-2026-0301/);
    await userEvent.clear(screen.getByRole("spinbutton"));
    await userEvent.type(screen.getByRole("spinbutton"), "30");
    await userEvent.click(screen.getByRole("button", { name: "예약" }));

    await waitFor(() => {
      expect(reserveMock).toHaveBeenCalledWith(
        "wo-1",
        { materialLotId: "lot-1", quantity: 30 },
        "csrf",
      );
    });
  });

  it("예약 권한이 없으면 필요한 권한을 설명한다", async () => {
    reservationsMock.mockResolvedValue([]);
    renderPanel({ canReserve: false, canRelease: false });

    expect(
      await screen.findByText(/자재 담당자 권한\(material-allocation:create\/release\)이/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "예약" })).not.toBeInTheDocument();
  });

  it("해제는 command를 호출하고 목록을 갱신한다", async () => {
    reservationsMock.mockResolvedValue([
      {
        id: "alloc-1",
        lotNumber: "ML-2026-0301",
        materialCode: "SEN-MAT-014",
        materialName: "적외선 감지 다이오드 어레이",
        unit: "EA",
        quantity: 50,
        status: "ACTIVE",
        closedReason: null,
        createdAt: "2026-09-03T01:00:00.000Z",
      },
    ]);
    releaseMock.mockResolvedValue([]);
    lotsMock.mockResolvedValue({ items: [], page: 1, pageSize: 20, total: 0 });
    renderPanel();

    await screen.findByText("ML-2026-0301");
    await userEvent.click(screen.getByRole("button", { name: "해제" }));

    await waitFor(() => {
      expect(releaseMock).toHaveBeenCalledWith("alloc-1", "csrf");
    });
  });

  it("첫 페이지 뒤의 가용 LOT도 선택하고 예약할 수 있다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    reservationsMock.mockResolvedValue([]);
    lotsMock.mockImplementation(async (params) => {
      const page = Number(params.get("page"));
      return {
        items: page === 1
          ? Array.from({ length: 100 }, (_, index) => ({
              ...availableLot,
              id: `lot-${index + 1}`,
              lotNumber: `ML-${index + 1}`,
            }))
          : [{ ...availableLot, id: "lot-101", lotNumber: "ML-101" }],
        page,
        pageSize: 100,
        total: 101,
      };
    });
    reserveMock.mockResolvedValue([]);
    renderPanel();

    await waitFor(() => expect(screen.getByRole("combobox")).toBeEnabled());
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: /ML-101 / }));
    await user.click(screen.getByRole("button", { name: "예약" }));

    await waitFor(() => expect(reserveMock).toHaveBeenCalledWith(
      "wo-1", { materialLotId: "lot-101", quantity: 10 }, "csrf",
    ));
    expect(lotsMock.mock.calls[1]?.[0].get("page")).toBe("2");
  });

  it.each(["reservations", "lots"])("%s 조회 실패를 빈 목록으로 숨기지 않고 재시도한다", async (source) => {
    reservationsMock.mockResolvedValue([]);
    lotsMock.mockResolvedValue(availablePage);
    if (source === "reservations") {
      reservationsMock.mockRejectedValueOnce(new Error("unavailable"));
    } else {
      lotsMock.mockRejectedValueOnce(new Error("unavailable"));
    }
    renderPanel();

    expect(await screen.findByRole("alert")).toHaveTextContent("불러오지 못했습니다");
    expect(screen.queryByText("아직 예약된 자재가 없습니다.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예약" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "다시 조회" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "예약" })).toBeEnabled());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("아직 예약된 자재가 없습니다.")).toBeInTheDocument();
  });

  it.each([170, 0])("예약 후 남은 가용 수량 %i를 다시 조회해 반영한다", async (remaining) => {
    reservationsMock.mockResolvedValue([]);
    lotsMock.mockResolvedValueOnce(availablePage).mockResolvedValue({
      ...availablePage,
      items: remaining === 0 ? [] : [{
        ...availableLot,
        reservedQuantity: 200 - remaining,
        availableQuantity: remaining,
      }],
      total: remaining === 0 ? 0 : 1,
    });
    reserveMock.mockResolvedValue([]);
    renderPanel();

    await waitFor(() => expect(screen.getByRole("button", { name: "예약" })).toBeEnabled());
    await userEvent.clear(screen.getByRole("spinbutton"));
    await userEvent.type(screen.getByRole("spinbutton"), String(200 - remaining));
    await userEvent.click(screen.getByRole("button", { name: "예약" }));

    await waitFor(() => expect(screen.getByRole("spinbutton")).toHaveAttribute("max", String(remaining)));
    if (remaining === 0) {
      expect(screen.getByRole("combobox")).toHaveTextContent("가용 자재가 없습니다");
      expect(screen.getByRole("button", { name: "예약" })).toBeDisabled();
    } else {
      expect(screen.getByRole("combobox")).toHaveTextContent("가용 170");
      await userEvent.clear(screen.getByRole("spinbutton"));
      await userEvent.type(screen.getByRole("spinbutton"), "171");
      expect(screen.getByRole("button", { name: "예약" })).toBeDisabled();
    }
  });

  it("해제 후 가용 수량이 생긴 LOT을 선택 목록에 복원한다", async () => {
    reservationsMock.mockResolvedValueOnce([{
      id: "alloc-1", lotNumber: availableLot.lotNumber,
      materialCode: availableLot.materialCode, materialName: availableLot.materialName,
      unit: "EA", quantity: 200, status: "ACTIVE", closedReason: null,
      createdAt: "2026-09-03T01:00:00.000Z",
    }]).mockResolvedValue([]);
    lotsMock.mockResolvedValueOnce({ ...availablePage, items: [], total: 0 })
      .mockResolvedValue(availablePage);
    releaseMock.mockResolvedValue([]);
    renderPanel();

    await userEvent.click(await screen.findByRole("button", { name: "해제" }));

    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent("가용 200"));
    expect(screen.getByRole("button", { name: "예약" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "해제" })).not.toBeInTheDocument();
  });

  it("저장 후 조회가 실패해도 저장 성공을 알리고 중복 예약을 막는다", async () => {
    reservationsMock.mockResolvedValue([]);
    lotsMock.mockResolvedValueOnce(availablePage)
      .mockRejectedValueOnce(new Error("refresh failed"))
      .mockResolvedValue(availablePage);
    reserveMock.mockResolvedValue([]);
    renderPanel();

    await waitFor(() => expect(screen.getByRole("button", { name: "예약" })).toBeEnabled());
    await userEvent.click(screen.getByRole("button", { name: "예약" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("불러오지 못했습니다");
    expect(screen.getByText("자재를 예약했습니다.")).toBeInTheDocument();
    expect(screen.queryByText("예약하지 못했습니다.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예약" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "다시 조회" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "예약" })).toBeEnabled());
    expect(reserveMock).toHaveBeenCalledTimes(1);
  });
});
