import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

export default class SketchExample extends React.Component {

  static get defaultProps() {
    return {
      onChange: () => {}
    }
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      displayColorPicker: false,
    };
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.props.onChange(color.rgb);
  };

  render() {
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${ this.props.color.r }, ${ this.props.color.g }, ${ this.props.color.b }, ${ this.props.color.a })`,
        },
        swatch: {
          padding: '5px',
          background: 'white',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.props.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
}
