import i18n from "../../plugins/i18n"

const {t} = i18n.global

// eslint-disable-next-line import/prefer-default-export
export const createSwal = function createSwal(
  text,
  icon = "success",
  showCancelButton = true,
  confirmButtonText = t("global.thank-you"),
  cancelButtonText = t("global.go-back"),
  buttonsStyling = false,
  confirmButton = "btn btn-primary",
  cancelButton = "btn btn-active-light"
) {
  return Swal.fire({
    icon,
    text,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    buttonsStyling,
    customClass: {confirmButton, cancelButton}
  })
}
