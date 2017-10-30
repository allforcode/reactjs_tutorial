function Square(props) {
  return (
    <button className={'square ' + (props.isWinner ? 'winner' : '') } onClick={ props.onClick } >
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let isWinner = false;
    if(this.props.winner){
      isWinner = this.props.winner.indexOf(i) !== -1;
      console.log(isWinner);
    }

    return (
      <Square
        key={i}
        isWinner={isWinner}
        value={this.props.squares[i]}
        onClick={ () => this.props.onClick(i) }
      />
    );
  }

  render() {
    const divs = [0, 1, 2];
    const n = 3;

    return (
      <div>
        {
          divs.map( (item, index) => {
            item *= n;
            // console.log('item=' + item + ', index=' + index);
            return (
              <div key={index} className="board-row">
              {
                 Array(3).fill(1).map((e, i) => {
                   // console.log('child_index=' + i + ', (item+child_index)='+ (i + item));
                      return this.renderSquare(item + i)
                 })
              }
              </div>
            );
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      isWin: [],
      order: 'asc',
      stepNumber: 0,
      xIsNext: true,
      disableButton: true
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if ( calculateWinner(squares) || squares[i] ){
      return;
    }

    squares[i] = this.state.xIsNext ? '🍎' : '🍏';

    const disableButton = (history.length < 1);
    console.log(history);
    console.log(disableButton);

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      isBold: '',
      xIsNext: !this.state.xIsNext,
      disableButton: disableButton
    });
  }

  jumpTo(move){
    const node = this.refs[move];
    this.setState({isBold: move});

    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) == 0,
    });
  }

  hundleOrder(){
    const order = this.state.order == 'asc' ? 'desc' : 'asc';
    this.setState({
      order: order
    });
  }

  hundleReset(){
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      isWin: [],
      order: 'asc',
      stepNumber: 0,
      xIsNext: true,
      disableButton: true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step, move) => {
      let desc = move ?
            'Go to move (' + move + ', ' + (history.length - 1) + ')':
            'Go to game start';

      desc = desc.toUpperCase();

      if( move === this.state.isBold ){
        return (
          <li key={move} ref={move} className={this.state.className} >
            <button type="button" className="btn btn-warning" style={{fontWeight: 900}} onClick={ () => this.jumpTo(move) }>{desc}</button>
          </li>
        );
      }else {
        return (
          <li key={move} ref={move} >
            <button type="button" className="btn btn-light" onClick={ () => this.jumpTo(move) }>{desc}</button>
          </li>
        );
      }

    });

    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? '🍎' : '🍏');
    }

    return (
      <div className="game">
        <div className="game-title">
          <div>
            <button type="button" className="btn btn-info" disabled={ this.state.disableButton } onClick={() => { this.hundleOrder()}} >ORDER: {this.state.order.toUpperCase()}</button>
            &nbsp;
            <button type="button" className="btn btn-primary" disabled={ this.state.disableButton } onClick={() => { this.hundleReset()}} >RESET</button>
          </div>
          <hr />
        </div>
        <div className="game-content">
          <div className="game-board">
            <Board
              winner={winner}
              squares={current.squares}
              onClick={ (i) => this.handleClick(i) }
            />
          </div>
          <div className="game-info">
            <div><h4>{ status }</h4></div>
            <ol>{ this.state.order === 'asc' ? moves : moves.reverse() }</ol>
          </div>
        </div>
      </div>
    );
  }
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}