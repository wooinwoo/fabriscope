import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { verdictInspection } from "../api/inspection-verdict";
import { InspectionVerdictPanel } from "./InspectionVerdictPanel";

vi.mock("../api/inspection-verdict", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../api/inspection-verdict")>();
  return { ...actual, verdictInspection: vi.fn() };
});

const verdictMock = vi.mocked(verdictInspection);

function renderPanel() {
  const onDone = vi.fn();
  const view = render(
    <InspectionVerdictPanel
      csrfToken="csrf"
      onDone={onDone}
      target={{
        inspectionId: "inspection-1",
        inspectionNumber: "INSP-2026-0106",
        specName: "절단 치수 검사 규격 v2",
        productionLotNumber: "PL-2026-092A",
      }}
    />,
  );
  return { onDone, ...view };
}

describe("InspectionVerdictPanel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("판정을 직접 선택하기 전에는 확정할 수 없다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    verdictMock.mockResolvedValue({ ok: true });
    renderPanel();

    expect(screen.getByRole("combobox", { name: "판정" })).toHaveTextContent("판정을 선택해 주세요");
    expect(screen.queryByText("보류는 재측정 전까지 진행을 막습니다")).not.toBeInTheDocument();
    const submit = screen.getByRole("button", { name: "판정 확정" });
    expect(submit).toBeDisabled();
    await user.click(submit);
    expect(verdictMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole("combobox", { name: "판정" }));
    await user.click(await screen.findByRole("option", { name: "합격 (PASS)", exact: true }));
    expect(submit).toBeEnabled();
    await user.click(submit);
    await waitFor(() => expect(verdictMock).toHaveBeenCalledWith(
      "inspection-1", { verdict: "PASS" }, "csrf",
    ));
  });

  it("검사 대상이 바뀌면 판정과 메모를 초기화하고 이전 요청 완료를 무시한다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const response = Promise.withResolvers<{ ok: true }>();
    verdictMock.mockReturnValue(response.promise);
    const { onDone, rerender } = renderPanel();
    await user.click(screen.getByRole("combobox", { name: "판정" }));
    await user.click(await screen.findByRole("option", { name: "합격 (PASS)", exact: true }));
    await user.type(screen.getByLabelText("판정 메모"), "첫 검사 결과");
    await user.click(screen.getByRole("button", { name: "판정 확정" }));
    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();

    rerender(<InspectionVerdictPanel csrfToken="csrf" onDone={onDone} target={{
      inspectionId: "inspection-2", inspectionNumber: "INSP-2",
      specName: "두 번째 검사", productionLotNumber: "PL-2",
    }} />);

    expect(screen.getByRole("combobox", { name: "판정" })).toHaveTextContent("판정을 선택해 주세요");
    expect(screen.getByLabelText("판정 메모")).toHaveValue("");
    expect(screen.getByRole("button", { name: "판정 확정" })).toBeDisabled();
    await act(async () => { response.resolve({ ok: true }); await response.promise; });
    expect(onDone).not.toHaveBeenCalled();
  });

  it("불합격을 선택하면 품질 처분 경고를 표시한다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderPanel();

    await user.click(screen.getByRole("combobox", { name: "판정" }));
    await user.click(
      await screen.findByRole("option", { name: "불합격 (FAIL)" }),
    );

    expect(
      await screen.findByText("불합격은 품질 처분 대상이 됩니다"),
    ).toBeInTheDocument();
  });

  it("보류를 선택하면 재측정 경고를 표시한다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderPanel();

    await user.click(screen.getByRole("combobox", { name: "판정" }));
    await user.click(await screen.findByRole("option", { name: "보류 (HOLD)" }));

    expect(
      await screen.findByText("보류는 재측정 전까지 진행을 막습니다"),
    ).toBeInTheDocument();
  });

  it("판정 확정은 선택 값과 메모를 전송한다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    verdictMock.mockResolvedValue({ ok: true });
    const { onDone } = renderPanel();

    await user.click(screen.getByRole("combobox", { name: "판정" }));
    await user.click(
      await screen.findByRole("option", { name: "불합격 (FAIL)" }),
    );
    await user.type(screen.getByLabelText("판정 메모"), "기준 초과 0.05mm");
    await user.click(screen.getByRole("button", { name: "판정 확정" }));

    await waitFor(() => {
      expect(verdictMock).toHaveBeenCalledWith(
        "inspection-1",
        { verdict: "FAIL", memo: "기준 초과 0.05mm" },
        "csrf",
      );
      expect(onDone).toHaveBeenCalled();
    });
  });
});
