import {
  App,
  Component,
} from '.'

class Time extends Component<Time> {
  public ticks = 0
}

App
.default()
.insertResource(new Time())
