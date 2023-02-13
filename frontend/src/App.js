import { useEffect, useState } from 'react'
import axios from 'axios'
import validator from 'validator'

import './App.css'

function App() {

  const URL_PREFIX = process.env.REACT_APP_ENVIRONMENT == "PROD" ? process.env.REACT_APP_DEPLOY_PREFIX : process.env.REACT_APP_DEV_PREFIX

  const [form, setForm] = useState({
    url: '',
    expires_on: null
  })

  const [shortURL, setShortURL] = useState(null)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [disableButton, setButtonDisabled] = useState(false)

  const handleSubmit = (e) => {

    e.preventDefault()

    console.log(validator.isURL(form.url))

    if (validator.isURL(form.url)) {

      setButtonDisabled(true)

      axios.post('http://localhost:3001/generate', form)
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
                <p>Done! Your URL is <span className="copy" onClick={() => { navigator.clipboard.writeText(URL_PREFIX + shortURL); alert("Copied to clipboard.") }}>{URL_PREFIX + shortURL}</span> <i>(click to copy!)</i></p>
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
            <input type="datetime-local" onChange={(e) => { setForm({ ...form, expires_on: e.target.value }) }} />
          </div>
          <button disabled={disableButton}>Generate</button>
        </form>
        <p>Created by <a href="https://lihaoquan.com/">Li Haoquan</a></p>
      </header>
    </div>
  )
}

export default App
