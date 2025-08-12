import store from "../../store"

/* eslint no-param-reassign: "off" */

// Create description object using property like language IDs
// e.g. {1: "<p>English</p>", 2: "<p>Arabic</p>"}
export const createEditorsData = function createEditorsData({editors, property, data, multiple}) {
  editors.forEach((editor) => {
    if (property) {
      if (multiple)
        data.forEach((element) => {
          if (editor.key === element.key) element.data[editor[property]] = editor.editor.getData()
        })
      else data[editor[property]] = editor.editor.getData()
    }
  })
}

export const createQuillEditorsData = function createQuillEditorsData({
  editors,
  property,
  data,
  multiple
}) {
  editors.forEach((editor) => {
    if (property) {
      if (multiple)
        data.forEach((element) => {
          if (editor.key === element.key) element.data[editor[property]] = editor.editor.getHTML()
        })
      else data[editor[property]] = editor.editor.getHTML()
    }
  })
}

// Create languages object using inserted arguments
export const createLanguages = function createLanguages(...args) {
  const {languages} = store.state
  const languagesArray = []

  // Initialize languages array with languages IDs
  languages.forEach((language) => {
    languagesArray.push({
      [["language", "id"].join("_")]: language.id
    })
  })

  // Loop over arguments (and their keys)
  args.forEach((arg) => {
    Object.keys(arg.values).forEach((key) => {
      // Loop over languages array and add value for matching IDs
      languagesArray.forEach((language) => {
        if (Number(key) === Number(language[["language", "id"].join("_")]))
          language[arg.key] = arg.values[key]
      })
    })
  })

  return languagesArray
}

export const createLanguagesCustom = function createLanguagesCustom({key, values, is_true = null}) {
  const {languages} = store.state
  const languagesArray = []

  // Initialize languages array with language IDs
  languages.forEach((language) => {
    const languageEntry = {[["language", "id"].join("_")]: language.id}

    // Add is_true if it's provided
    if (is_true !== null) {
      languageEntry.is_true = is_true
    }

    languagesArray.push(languageEntry)
  })

  // Loop over values to populate language entries
  Object.keys(values).forEach((langId) => {
    languagesArray.forEach((language) => {
      if (Number(langId) === Number(language[["language", "id"].join("_")])) {
        language[key] = values[langId]
      }
    })
  })

  return languagesArray
}

// Get array of media IDs to use it on submit
export const createMedia = function createMedia(media) {
  const mediaArray = []
  const property = ["media", "id"].join("_")

  // Loop over media array and add media-id property to its items
  media.forEach((mediaItem) => {
    if (mediaItem.response)
      if (mediaItem.response.result) mediaItem[property] = mediaItem.response.result.id
  })

  // When media has one or more item add them to media array
  if (media.length > 0)
    media.forEach((item) => {
      mediaArray.push({[property]: item[property]})
    })

  return mediaArray
}
