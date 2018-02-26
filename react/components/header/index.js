import React, { Component } from 'react'

export default class Header extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <header>
        <h1>{this.props.headerText}</h1>
      </header>
    )
  }
}

Header.defaultProps = {
  headerText: 'Github Profile Search yiiizzzooo'
}
