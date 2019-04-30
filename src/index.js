import React, { Component } from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Circle, Text, Group } from "react-konva";

const balls = [];
const CIRCLE_RADIUS = 25;
// Browser wdith dimension;
const CLIENT_HEIGHT = window.innerHeight;
// Browser hieght dimension;
const CLIENT_WIDTH = window.innerWidth;

const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getRandomPositions = () => {
  var randx = getRandomInteger(
    CIRCLE_RADIUS * 2,
    CLIENT_WIDTH - CIRCLE_RADIUS * 2
  );
  var newInt = getRandomInteger(
    CIRCLE_RADIUS * 2,
    CLIENT_HEIGHT - CIRCLE_RADIUS * 2
  );

  for (var i = 0; i < balls.length; i++) {
    if (
      randx <= balls[i].x + CIRCLE_RADIUS ||
      randx >= balls[i].x - CIRCLE_RADIUS
    ) {
      if (
        newInt <= balls[i].y + CIRCLE_RADIUS ||
        newInt >= balls[i].y - CIRCLE_RADIUS
      ) {
        randx = getRandomInteger(
          CIRCLE_RADIUS * 2,
          CLIENT_WIDTH - CIRCLE_RADIUS * 2
        );
        newInt = getRandomInteger(
          CIRCLE_RADIUS * 2,
          CLIENT_HEIGHT - CIRCLE_RADIUS * 2
        );
        i = 0;
      }
    }
  }
  return { x: randx, y: newInt };
};

const getBool = () =>
  /*Create a num from 0 to 100 if < 50 ==> true else false if > 50; */
  Math.floor(Math.random() * (100 - 1 + 1) + 1) < 50 ? 1 : 0;

const randomLoc = () => {
  if (getBool()) {
    return 1;
  }
  return -1;
};

class CircleBall extends React.Component {
  state = {
    pos: { x: Number(this.props.x), y: Number(this.props.y) },
    color: Konva.Util.getRandomColor(),
    dX: randomLoc(),
    dY: randomLoc()
  };

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  // Note use of arrow function to eliminate need for .bind(this) in constructor
  updateAnimationState = () => {
    var pos = this.state.pos;
    var dX = this.state.dX;
    var dY = this.state.dY;
    var color = this.state.color;

    balls[this.props.ballId] = {
      x: this.state.pos.x,
      y: this.state.pos.y,
      dX: this.state.dX,
      dY: this.state.dY,
      update: false
    };

    if (pos.x > CLIENT_WIDTH - CIRCLE_RADIUS || pos.x < 0 + CIRCLE_RADIUS) {
      dX = dX * -1;
    }
    if (pos.y > CLIENT_HEIGHT - CIRCLE_RADIUS || pos.y < 0 + CIRCLE_RADIUS) {
      dY = dY * -1;
    }

    if (balls[this.props.ballId].update) {
      dX = balls[this.props.ballId].dX;
      dY = balls[this.props.ballId].dY;
    } else {
      for (var i = 0; i < balls.length; i++) {
        if (i != this.props.ballId) {
          var len = Math.sqrt(
            Math.pow(pos.x - balls[i].x, 2) + Math.pow(pos.y - balls[i].y, 2)
          );
          if (CIRCLE_RADIUS * 2 >= len) {
            color = Konva.Util.getRandomColor();
            /* inversing inital dX and dY and updating new deltas */
            var update_dY = -1 * dY;
            var update_dX = -1 * dX;

            var update_dY2 = balls[i].dY * -1;
            var update_dX2 = balls[i].dX * -1;

            dX = update_dX;
            dY = update_dY;
            balls[i].dX = update_dX2;
            balls[i].dY = update_dY2;
            [i].update = true;
          }
        }
      }
    }
    pos.x = pos.x + dX;
    pos.y = pos.y + dY;
    this.setState({ pos, dX, dY, color });
  };

  componentDidUpdate() {
    // https://reactjs.org/docs/react-component.html#componentdidupdate
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    return (
      <Group x={this.state.pos.x} y={this.state.pos.y}>
        <Circle
          shadowBlur={30}
          radius={CIRCLE_RADIUS}
          onClick={this.handleClick}
          fill={this.state.color}
        />
        <Text text={this.props.ballId} />
      </Group>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <CircleBall
            /*text number displayed on the ball;*/
            ballId="0"
            x={getRandomInteger(0, CLIENT_WIDTH - CIRCLE_RADIUS)}
            y={getRandomInteger(0, CLIENT_HEIGHT - CIRCLE_RADIUS)}
          />
          <CircleBall
            ballId="1"
            x={getRandomInteger(0, CLIENT_WIDTH - CIRCLE_RADIUS)}
            y={getRandomInteger(0, CLIENT_HEIGHT - CIRCLE_RADIUS)}
          />
        </Layer>
      </Stage>
    );
  }
}

render(<App />, document.getElementById("root"));
