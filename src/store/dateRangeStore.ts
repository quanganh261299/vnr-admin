import { create } from "zustand";
import { devtools } from "zustand/middleware";
import dayjs, { Dayjs } from "dayjs";

interface DateRangeStore {
    dateRange: [Dayjs | null, Dayjs | null];
    setDateRange: (newRange: [Dayjs | null, Dayjs | null]) => void;
}

const useDateRangeStore = create<DateRangeStore>()(
    devtools(
        (set) => ({
            dateRange: [dayjs().subtract(1, "month"), dayjs()],
            setDateRange: (newRange: [Dayjs | null, Dayjs | null]) =>
                set({ dateRange: newRange }),
        }),
        {
            name: "DateRangeStore",
        }
    )
);

export default useDateRangeStore;
