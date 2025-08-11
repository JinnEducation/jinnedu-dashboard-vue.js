import axiosClient from "@/plugins/axios"
import store from "../store"

/* eslint no-param-reassign: "off" */
const getMenuAbilities = function getMenuAbilities(path, abilities) {
  let pathCurrent = path.toString().replace("/dashboard/", "").replace("/", ".")

  // Remove any trailing number ID from pathCurrent, like 'exams.index/61' becomes 'exams.index'
  pathCurrent = pathCurrent.replace(/\/\d+$/, "")

  const {navigation} = store.state
  let menuAbilitiesPromise = null

  if (navigation) {
    navigation.forEach((menu) =>
      menu.children.forEach((menuItem) => {
        if (menuItem.link === pathCurrent) {
          menuAbilitiesPromise = axiosClient
            .get(`/menu-abilities/${menuItem.abilities}`)
            .then((response) => {
              response.data.result.childrens.forEach((childrenItem) => {
                switch (childrenItem.name) {
                  case "index":
                    abilities.value.index = childrenItem.checked
                    break
                  case "admin-index":
                    abilities.value.adminIndex = childrenItem.checked
                    break
                  case "create":
                    abilities.value.create = childrenItem.checked
                    break
                  case "edit":
                    abilities.value.edit = childrenItem.checked
                    break
                  case "destroy":
                    abilities.value.destroy = childrenItem.checked
                    break
                  case "show":
                    abilities.value.show = childrenItem.checked
                    break
                  case "register-as-tutor":
                    abilities.value.registerTutor = childrenItem.checked
                    break
                  case "un-register-as-tutor":
                    abilities.value.unRegisterTutor = childrenItem.checked
                    break
                  case "create-student-link":
                    abilities.value.createStudentLink = childrenItem.checked
                    break
                  case "create-tutor-link":
                    abilities.value.createTutorLink = childrenItem.checked
                    break
                  case "add-note":
                    abilities.value.addNote = childrenItem.checked
                    break
                  case "add-review":
                    abilities.value.addReview = childrenItem.checked
                    break
                  case "add-complaint":
                    abilities.value.addComplaint = childrenItem.checked
                    break
                  case "upload-file":
                    abilities.value.uploadFile = childrenItem.checked
                    break
                  default:
                    abilities.value.default = true
                }
              })
            })
        }
      })
    )
  }

  return menuAbilitiesPromise
}

export default getMenuAbilities
