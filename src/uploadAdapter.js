import store from "./store/index"

class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this.initRequest()
          this.initListeners(resolve, reject, file)
          this.sendRequest(file)
        })
    )
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  initRequest() {

    // eslint-disable-next-line no-multi-assign
    const xhr = (this.xhr = new XMLHttpRequest())

    // Set the authorization header with the token from the store
    const {token} = store.state.user

    // Configure the request before opening it
    xhr.open("POST", "https://learning.jinnedu.com/api/medias/create", true)
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)

    // Set the responseType after setting headers and before sending the request
    xhr.responseType = "json"
  }

  // Initializes event listeners for XMLHttpRequest events.
  initListeners(resolve, reject, file) {
    const xhr = this.xhr

    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100
        this.loader.uploadTotal = evt.total
        this.loader.uploaded = evt.loaded
      }
    })

    xhr.upload.addEventListener("error", () => {
      reject(`Upload failed for ${file.name}`)
    })

    xhr.upload.addEventListener("abort", () => {
      reject(`Upload aborted for ${file.name}`)
    })

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          const response = xhr.response
          const imageUrl = `https://learning.jinnedu.com/${response.result.path}` // Adjust this line based on your actual response structure
          resolve({default: imageUrl}) // Return the image URL
        } else {
          reject(`Upload failed with status ${xhr.status}`)
        }
      }
    }
  }

  // Sends the XMLHttpRequest to upload the file.
  sendRequest(file) {
    const formData = new FormData()
    formData.append("attachment", file) // Append file as "attachment" parameter
    this.xhr.send(formData)
  }
}

export default function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new MyUploadAdapter(loader)
  }
}
