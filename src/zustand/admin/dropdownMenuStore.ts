import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type DropdownStoreProps = {
  dropdownVisible: boolean;
  setDropdown: (visible: boolean) => void;
};

export const useDropdownMenuStore = createWithEqualityFn<DropdownStoreProps>(
  (set) => ({
    dropdownVisible: false,
    setDropdown: (visible) => set({ dropdownVisible: visible }),
  }),
  shallow
);
