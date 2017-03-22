import {el, setAttr, text, mount} from 'redom'

class Redomify {
  constructor () {
    this.counter = 0
    this.render()
    console.log(this)
  }
  render () {
    return <div @el>
      <h1 class="test" id="yay">
        Redomify <3
      </h1>
      <p @mypara style="{{ 'display:' + ((this.show)? 'block': 'none') }}">
        {{ "Hello Redom " + this.counter + " People" }}
      </p>
      <div>
        <button data-counter="{{this.counter}}" onclick="this.count()">{{this.counter}}</button>
        <button onclick="this.toggleShow()">Toggle</button>
      </div>
    </div>;
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

mount(document.body, new Redomify())
