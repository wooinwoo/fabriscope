export interface DemoProduct {
    code: string;
    name: string;
    unit: string;
}
export declare const DEMO_PRODUCTS: DemoProduct[];
export interface DemoWorkOrder {
    orderNumber: string;
    productCode: string;
    productName: string;
    plannedQuantity: number;
    unit: string;
    dueDate: Date;
    status: "DRAFT" | "RELEASED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    progressPercent: number;
    currentStepName: string | null;
    blockedReason: string | null;
}
export declare const DEMO_WORK_ORDERS: DemoWorkOrder[];
