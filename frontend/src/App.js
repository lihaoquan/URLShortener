import { useEffect, useState } from 'react'
import axios from 'axios'
import validator from 'validator'

import './App.css'

function App() {

  const [form, setForm] = useState({
    url: '',
    expires_on: null
  })

  const [shortURL, setShortURL] = useState(null)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [disableButton, setButtonDisabled] = useState(false)

  let tryCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortURL)
      alert("Copied to clipboard.")
    } else {
      alert("Unfortunately, this does not work without https protocol (it works on local). Please copy the link manually: " + shortURL)
    }
  }

  const handleSubmit = (e) => {

    e.preventDefault()

    // Check that expiry date is not before current time.
    if (form.expires_on != null) {
      if (new Date() > new Date(form.expires_on)) {
        setHasError(true)
        setShowFeedback(true)
        setErrorMessage("Expiry date has already lapsed!")
        return
      }
    }

    if (validator.isURL(form.url)) {

      setButtonDisabled(true)

      axios.post(process.env.REACT_APP_RUNTIME_ENV == "PROD" ? process.env.REACT_APP_API_ENDPOINT_PROD + 'generate' : process.env.REACT_APP_API_ENDPOINT_DEV + 'generate', form)
        .then(function (response) {
          if (response.status == 200) {
            setShortURL(response.data.data)
            setShowFeedback(true)
            setForm({ url: '', expires_on: null })
            setButtonDisabled(false)
            setHasError(false)
          }
        }).catch(function (error) {
          setHasError(true)
          setShowFeedback(true)
          setButtonDisabled(false)
          setErrorMessage("Error! Please try again later.")
        })
    } else {
      setHasError(true)
      setShowFeedback(true)
      setErrorMessage("Please input a valid URL!")
    }
  }

  return (
    <div className="App">
      <header>
        <h1>Shorten URL</h1>
        <p>Enter a URL to be shortened.</p>
        <p><i>(It is optional to set an expiry date.)</i></p>
        {
          showFeedback &&
          <div className="feedback">
            {
              shortURL != null && !hasError &&
              <div className="success">
                <p>Done! Your URL is <span className="copy" onClick={() => { tryCopy() }}>{shortURL}</span> <i>(click to copy!)</i></p>
              </div>
            }
            {
              hasError &&
              <div className="error">
                <p>{errorMessage}</p>
              </div>
            }
          </div>
        }
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>URL</label>
            <input type="url" placeholder="Enter URL" required value={form.url} onChange={(e) => { setForm({ ...form, url: e.target.value }) }} />
          </div>
          <div className="form-group">
            <label>Expiry</label>
            <input type="datetime-local" value={form.expires_on ? form.expires_on : ''} onChange={(e) => { setForm({ ...form, expires_on: e.target.value }) }} />
          </div>
          <button disabled={disableButton}>Generate</button>
        </form>
        <p>Created by <a href="https://lihaoquan.com/">Li Haoquan</a></p>
      </header>
    </div>
  )
}

export default App
