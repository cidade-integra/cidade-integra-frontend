import { create } from "zustand";

const useModalStore = create((set) => ({
  isOpen: false,
  modalType: null,
  modalProps: {},
  modalOptions: { overlayColor: "bg-black/80" },
  onClose: null,
  resolver: null, // armazenará o resolve do Promise

  openModal: (type, modalProps = {}, onClose = null, modalOptions = {}) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        modalType: type,
        modalProps,
        onClose,
        modalOptions, // ✅ agora salva corretamente
        resolver: resolve,
      })
    })
  },

  closeModal: (result = null) =>
    set((state) => {
      if (typeof state.onClose === "function") {
        state.onClose(result);
      }
      if (state.resolver) {
        state.resolver(result) // retorna o result ao chamador
      }
      return {
        isOpen: false,
        modalType: null,
        modalProps: {},
        modalOptions: { overlayColor: "bg-black/80" }, // ✅ reset padrão
        onClose: null,
        resolver: null,
      };
    }),
}));

export default useModalStore;
