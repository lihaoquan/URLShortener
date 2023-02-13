import { useEffect, useState } from 'react';
import axios from 'axios'

import './App.css';

function App() {

  const [form, setForm] = useState({
    url: '',
    expires_on: null
  })

  const handleSubmit = (e) => {

    e.preventDefault()

    axios.post('http://localhost:3000/generate', form)
      .then(function (response) {
        
      }).catch(function (error) {

      })
  }

  return (
    <div className="App">
      <header>
        <h1>Shorten URL</h1>
        <p>Enter a URL to be shortened.</p>
        <p><i>(It is optional to set an expiry date.)</i></p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>URL</label>
            <input type="url" placeholder="Enter URL" required onChange={(e) => { setForm({ ...form, url: e.target.value }) }} />
          </div>
          <div className="form-group">
            <label>Expiry</label>
            <input type="datetime-local" onChange={(e) => { setForm({ ...form, expires_on: e.target.value }) }} />
          </div>
          <button>Generate</button>
        </form>
        <p>Created by <a href="https://lihaoquan.com/">Li Haoquan</a></p>
      </header>
    </div>
  );
}

export default App;
