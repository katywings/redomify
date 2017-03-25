// @flow

import * as Redom from 'redom'

class Redomify {
  constructor () {
    this.counter = 0
    this.template('hey', true)
    console.log(this)
  }
  template (message, showSecond) {
    <div @el>
      <h1 class="{message}" id="yay">
        Redomify <3
      </h1>
      <p @mypara style="{{ 'display:' + ((this.show)? 'block': 'none') }}">
        {{ "Hello Redom " + this.counter + " People" }}
      </p>
      <p r-if="{ showSecond }">
        {{ "A second way " + this.counter + " People" }}
      </p>
      <p r-if="{{ this.show }}">
        {{ "A third way " + this.counter + " People" }}
      </p>
      <input readony placeholder="hey" />
      <circle r-svg r="50" cx="25" cy="25"></circle>
      <svg>
        <circle r="50" cx="25" cy="25"></circle>
      </svg>
      <div>
        <button data-counter="{{this.counter}}" onclick="{{ this.count() }}">{{this.counter}}</button>
        <button onclick="this.toggleShow()">Toggle</button>
      </div>
    </div>
  }
  toggleShow () {
    this.show = !this.show
    this.update()
  }
  count () {
    this.counter++;
    this.update()
    console.log(this)
  }
}

Redom.mount(document.body, new Redomify())
