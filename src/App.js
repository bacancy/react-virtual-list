import React, { Component } from 'react';
import VirtualList from './core/VirtualList';
import './App.css';
import { names, desc } from "./utils/Constant";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0,
      recordList: [],

      fetchMoreRecord: false,
      dynamicWidth: false,
      dynamicHeight: false,
      fullWidthContent: false,
      classNameList: '',
      dynamicHeightWithlign: false,
      numberRenderedOffScreen: '',
      orientation: 'vertical',

      appKey: Math.random()
    }

    this.recordPerAPI = 50;
    this.fetchMore = this.fetchMore.bind(this);
  }

  componentDidMount() {
    const { counter } = this.state;
    this.getData(counter);
  }

  //#region GET RECORDS

  // Promise based function for API use
  getDataByPage(page) {
    return new Promise((resolve, reject) => {
      const data = [];
      let x = (page * this.recordPerAPI) + 1;
      for (let i = x; i < x + this.recordPerAPI; i++) {
        data.push({ name: 'Name ' + i });
      }
      setTimeout(() => {
        resolve(data);
      }, 500);
    })
  }

  // get record list by API call
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

  // handle fetch more record functionality
  fetchMore() {
    let { counter } = this.state;
    counter++;
    this.setState({ counter });
    this.getData(counter);
  }

  //#endregion

  render() {
    const { appKey, fetchMoreRecord, dynamicWidth, fullWidthContent, classNameList, numberRenderedOffScreen, orientation, dynamicHeight, dynamicHeightWithlign } = this.state;

    let boxStyle = {};
    if (orientation === 'vertical') {
      boxStyle = { height: 400, border: '1px solid #ddd' }
    }

    return (
      <div>
        <h3>Virtual List</h3>
        <div className="actions">
          <div className="item">
            Orientation:
            <select value={orientation} onChange={(e) => this.setState({
              orientation: e.target.value,
              fullWidthContent: false,
              appKey: Math.random()
            })}>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div className="item">
            <input
              type="checkbox"
              checked={fetchMoreRecord}
              onChange={(e) => this.setState({ fetchMoreRecord: e.target.checked })}
            /> Fetch more record</div>
          <div className="item">
            <input
              type="checkbox"
              checked={dynamicWidth}
              onChange={(e) => this.setState({ dynamicWidth: e.target.checked, fullWidthContent: false })}
            />Dynamic width of content</div>
          {orientation === 'horizontal' ?
            <div className="item">
              <input
                type="checkbox"
                checked={dynamicHeight}
                onChange={(e) => this.setState({ dynamicHeight: e.target.checked, fullWidthContent: false })}
              />Dynamic height of content</div>
            : null}
          {orientation === 'horizontal' ?
            <div className="item">
              <input
                type="checkbox"
                checked={dynamicHeightWithlign}
                onChange={(e) => this.setState({
                  dynamicHeightWithlign: e.target.checked,
                  fullWidthContent: false
                })}
              />Dynamic height of content(Align Center)</div>
            : null}
          {orientation === 'vertical' ?
            <div className="item">
              <input
                type="checkbox"
                checked={fullWidthContent}
                onChange={(e) => this.setState({
                  fullWidthContent: e.target.checked,
                  dynamicWidth: false
                })}
              />Full width of content</div>
            : null}
          <div className="item">
            Class name:
            <input
              type="text"
              placeholder="Enter class name"
              value={classNameList}
              onChange={(e) => this.setState({ classNameList: e.target.value })}
            />
          </div>
          <div className="item">
            Number rendered off screen:
            <input
              type="number"
              placeholder="Enter number"
              value={numberRenderedOffScreen}
              onChange={(e) => this.setState({
                numberRenderedOffScreen: e.target.value,
                appKey: Math.random()
              })}
            />
          </div>
          <div style={{ clear: 'both' }}></div>
        </div>

        <div key={appKey} style={boxStyle}>
          <VirtualList
            fetchMore={fetchMoreRecord ? this.fetchMore : null}
            className={classNameList ? classNameList : ''}
            numberRenderedOffScreen={numberRenderedOffScreen !== '' ? parseInt(numberRenderedOffScreen) : 5}
            orientation={orientation}
          >
            {this.state.recordList
              .map((d, i) => {
                return <div key={i}
                  className={orientation === 'vertical' ? `box profile${fullWidthContent ? ' full-width' : ''}` : 'hbox profile'}
                  style={{
                    width: dynamicWidth ? (200 + i) : null,
                    height: (dynamicHeight || dynamicHeightWithlign) ? (364 + i) : null,
                    minWidth: dynamicWidth ? (200 + i) : null,
                    justifyContent: dynamicHeightWithlign ? 'center' : '',
                    alignSelf: dynamicHeightWithlign ? 'center' : '',
                  }}>
                  <div>
                    <img src={`https://randomuser.me/api/portraits/men/${i % 70}.jpg`}
                      alt="demo profile" />
                    <div className="info">
                      <h4>{names[i % 55]}</h4>
                      <span>{desc[i % 55]}</span>
                      <a href="javascript:;">View More...</a>
                    </div>
                  </div>
                </div>
              })}
          </VirtualList>
        </div>
      </div>
    );
  }
}

export default App;
