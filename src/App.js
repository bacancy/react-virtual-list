import React, { Component } from 'react';
import VirtualList from './core/VirtualList';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0,
      recordList: [],

      fetchMoreRecord: false,
      dynamicWidth: false,
      fullWidthContent: false,
      classNameList: '',
      numberRenderedOffScreen: ''
    }

    this.recordPerAPI = 50;
    this.fetchMore = this.fetchMore.bind(this);
  }

  componentDidMount() {
    const { counter } = this.state;
    this.getData(counter);
  }

  //#region GET RECORDS

  getDataByPage(page) {
    return new Promise((resolve, reject) => {
      const data = [];
      let x = (page * this.recordPerAPI) + 1;
      for (let i = x; i < x + this.recordPerAPI; i++) {
        data.push({ name: 'Name ' + i });
      }
      setTimeout(() => {
        resolve(data);
      }, 1000);
    })
  }

  getData(page) {
    this.getDataByPage(page)
      .then(records => {
        const { recordList } = this.state;
        recordList.push(...records);
        this.setState({ recordList }, () => {
          console.log("Record list :: ", this.state.recordList);
        });
      })
      .catch(err => console.log('Error occured while fetching data:' + err));
  }

  fetchMore() {
    let { counter } = this.state;
    counter++;
    this.setState({ counter });
    this.getData(counter);
  }

  //#endregion

  render() {
    const { fetchMoreRecord, dynamicWidth, fullWidthContent, classNameList, numberRenderedOffScreen } = this.state;
    return (
      <div>
        <h3>Virtual List: (Orientation: Vertical)</h3>
        <div className="actions">
          <div className="item"><input type="checkbox" checked={fetchMoreRecord} onChange={(e) => this.setState({ fetchMoreRecord: e.target.checked })} />Fetch more record</div>
          <div className="item"><input type="checkbox" checked={dynamicWidth} onChange={(e) => this.setState({ dynamicWidth: e.target.checked })} />Dynamic width of content</div>
          <div className="item"><input type="checkbox" checked={fullWidthContent} onChange={(e) => this.setState({ fullWidthContent: e.target.checked })} />Full width of content</div>
          <div className="item">Class name: <input type="text" placeholder="Enter class name" value={classNameList} onChange={(e) => this.setState({ classNameList: e.target.value })} /></div>
          <div className="item">Number rendered off screen: <input type="number" placeholder="Enter number" value={numberRenderedOffScreen} onChange={(e) => this.setState({ numberRenderedOffScreen: e.target.value })} /></div>
          <div style={{ clear: 'both' }}></div>
        </div>
        <div style={{ height: 400, border: '1px solid #ddd' }}>
          <VirtualList fetchMore={fetchMoreRecord ? this.fetchMore : null} className={classNameList ? classNameList : ''}
            numberRenderedOffScreen={numberRenderedOffScreen != '' ? numberRenderedOffScreen : 5}>
            {this.state.recordList
              .map((d, i) => {
                return <div key={i} className="box" style={{
                  width: dynamicWidth ? (20 + (i * 3)) : (fullWidthContent ? '100%' : 200),
                  float: fullWidthContent ? 'none' : 'left',
                }}>{d.name}</div>
              })}
          </VirtualList>
          {/* <VirtualList fetchMore={this.fetchMore} className={'this'}>
            {this.state.recordList
              .map((d, i) => {
                return <div key={i} className="box" style={{ width: 20 + (i * 3) }}>{d.name}</div>
              })}
          </VirtualList> */}
        </div>
      </div>
    );
  }
}

export default App;
