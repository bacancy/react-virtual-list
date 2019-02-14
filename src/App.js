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
      numberRenderedOffScreen: '',
      orientation: 'vertical',

      appKey: Math.random()
    }

    this.recordPerAPI = 50;
    this.fetchMore = this.fetchMore.bind(this);

    this.names = [
      "Gaynelle Delreal",
      "Donnie Gisi",
      "Jefferson Jennette",
      "Daniele Cogburn",
      "Sherril Hinz",
      "Lucienne Claassen",
      "Laurinda Giampaolo",
      "Toshia Lillibridge",
      "Kymberly Selfridge",
      "Aracely Fonda",
      "Lisbeth Bredeson",
      "Leonie Canino",
      "Willie Baginski",
      "Lacie Knop",
      "Debora Orsborn",
      "Ivana Jackson",
      "Lilly Didier",
      "Shea Dickerson",
      "Gerry Yant",
      "Kathe Pratts",
      "Minerva Plumb",
      "Arica Breslin",
      "Lucinda Dresel",
      "Robbyn Grumbles",
      "Signe Lovette",
      "Tyler Parks",
      "Long Keene",
      "Amber Wright",
      "Chieko Ruse",
      "Cody Villalobos",
      "Lynette Aguirre",
      "Rosana Hayworth",
      "Carlee Starnes",
      "Sharon Grossi",
      "Mitzie Erhart",
      "Natalia Nack",
      "Ina Westerman",
      "Adina Sallee",
      "Gerri Shadwick",
      "Eleonora Papas",
      "Princess Greenidge",
      "Otha Proulx",
      "Ruben Lytch",
      "Vania Vester",
      "Jillian Wherry",
      "Xiao Litherland",
      "Clement Harrington",
      "Roxana Gledhill",
      "Hayden Lineberry",
      "Gaylord Musick",
      "Gaynelle Delreal",
      "Donnie Gisi",
      "Jefferson Jennette",
      "Daniele Cogburn",
      "Sherril Hinz",
      "Lucienne Claassen",
      "Laurinda Giampaolo",
      "Toshia Lillibridge",
      "Kymberly Selfridge",
      "Aracely Fonda",
      "Lisbeth Bredeson",
      "Leonie Canino",
      "Willie Baginski",
      "Lacie Knop",
      "Debora Orsborn",
      "Ivana Jackson",
      "Lilly Didier",
      "Shea Dickerson",
      "Gerry Yant",
      "Kathe Pratts",
      "Minerva Plumb",
      "Arica Breslin",
      "Lucinda Dresel",
      "Robbyn Grumbles",
      "Signe Lovette",
      "Tyler Parks",
      "Long Keene",
      "Amber Wright",
      "Chieko Ruse",
      "Cody Villalobos",
      "Lynette Aguirre",
      "Rosana Hayworth",
      "Carlee Starnes",
      "Sharon Grossi",
      "Mitzie Erhart",
      "Natalia Nack",
      "Ina Westerman",
      "Adina Sallee",
      "Gerri Shadwick",
      "Eleonora Papas",
      "Princess Greenidge",
      "Otha Proulx",
      "Ruben Lytch",
      "Vania Vester",
      "Jillian Wherry",
      "Xiao Litherland",
      "Clement Harrington",
      "Roxana Gledhill",
      "Hayden Lineberry",
      "Gaylord Musick",
    ];

    this.desc = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Nunc dapibus nunc eget neque vehicula, ut blandit nisl commodo.",
      "Nam et diam tincidunt, finibus lorem ac, interdum diam.",
      "Mauris quis est eu ipsum pellentesque tempor.",
      "Fusce faucibus est quis ante vehicula, quis maximus odio egestas.",
      "Nunc in dui vel leo varius euismod eget vestibulum leo.",
      "Integer placerat magna in metus pulvinar tempor.",
      "Ut auctor neque vel tincidunt fermentum.",
      "Nulla aliquam magna eu consectetur viverra.",
      "Pellentesque a nunc ut sapien posuere tempor vitae et nulla.",
      "Nulla porttitor dui scelerisque tortor cursus congue.",
      "Nullam hendrerit leo a facilisis cursus.",
      "Proin varius urna quis egestas iaculis.",
      "Etiam volutpat sapien quis lacus faucibus, quis faucibus purus sollicitudin.",
      "Vivamus et libero aliquet nibh convallis elementum vel nec ante.",
      "Suspendisse vitae enim accumsan turpis auctor porttitor.",
      "Sed eu urna et ligula semper elementum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Nunc dapibus nunc eget neque vehicula, ut blandit nisl commodo.",
      "Nam et diam tincidunt, finibus lorem ac, interdum diam.",
      "Mauris quis est eu ipsum pellentesque tempor.",
      "Fusce faucibus est quis ante vehicula, quis maximus odio egestas.",
      "Nunc in dui vel leo varius euismod eget vestibulum leo.",
      "Integer placerat magna in metus pulvinar tempor.",
      "Ut auctor neque vel tincidunt fermentum.",
      "Nulla aliquam magna eu consectetur viverra.",
      "Pellentesque a nunc ut sapien posuere tempor vitae et nulla.",
      "Nulla porttitor dui scelerisque tortor cursus congue.",
      "Nullam hendrerit leo a facilisis cursus.",
      "Proin varius urna quis egestas iaculis.",
      "Etiam volutpat sapien quis lacus faucibus, quis faucibus purus sollicitudin.",
      "Vivamus et libero aliquet nibh convallis elementum vel nec ante.",
      "Suspendisse vitae enim accumsan turpis auctor porttitor.",
      "Sed eu urna et ligula semper elementum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Nunc dapibus nunc eget neque vehicula, ut blandit nisl commodo.",
      "Nam et diam tincidunt, finibus lorem ac, interdum diam.",
      "Mauris quis est eu ipsum pellentesque tempor.",
      "Fusce faucibus est quis ante vehicula, quis maximus odio egestas.",
      "Nunc in dui vel leo varius euismod eget vestibulum leo.",
      "Integer placerat magna in metus pulvinar tempor.",
      "Ut auctor neque vel tincidunt fermentum.",
      "Nulla aliquam magna eu consectetur viverra.",
      "Pellentesque a nunc ut sapien posuere tempor vitae et nulla.",
      "Nulla porttitor dui scelerisque tortor cursus congue.",
      "Nullam hendrerit leo a facilisis cursus.",
      "Proin varius urna quis egestas iaculis.",
      "Etiam volutpat sapien quis lacus faucibus, quis faucibus purus sollicitudin.",
      "Vivamus et libero aliquet nibh convallis elementum vel nec ante.",
      "Suspendisse vitae enim accumsan turpis auctor porttitor.",
      "Sed eu urna et ligula semper elementum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Nunc dapibus nunc eget neque vehicula, ut blandit nisl commodo.",
      "Nam et diam tincidunt, finibus lorem ac, interdum diam.",
      "Mauris quis est eu ipsum pellentesque tempor.",
      "Fusce faucibus est quis ante vehicula, quis maximus odio egestas.",
      "Nunc in dui vel leo varius euismod eget vestibulum leo.",
      "Integer placerat magna in metus pulvinar tempor.",
      "Ut auctor neque vel tincidunt fermentum.",
      "Nulla aliquam magna eu consectetur viverra.",
      "Pellentesque a nunc ut sapien posuere tempor vitae et nulla.",
      "Nulla porttitor dui scelerisque tortor cursus congue.",
      "Nullam hendrerit leo a facilisis cursus.",
      "Proin varius urna quis egestas iaculis.",
      "Etiam volutpat sapien quis lacus faucibus, quis faucibus purus sollicitudin.",
      "Vivamus et libero aliquet nibh convallis elementum vel nec ante.",
      "Suspendisse vitae enim accumsan turpis auctor porttitor.",
      "Sed eu urna et ligula semper elementum."
    ]

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
      }, 500);
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
    const { appKey, fetchMoreRecord, dynamicWidth, fullWidthContent, classNameList, numberRenderedOffScreen, orientation } = this.state;

    let boxStyle = {};
    if (orientation === 'vertical') {
      boxStyle = { height: 400, border: '1px solid #ddd' }
    }

    return (
      <div>
        <h3>Virtual List</h3>
        <div className="actions">
          <div className="item">
            Orientation: <select value={orientation} onChange={(e) => this.setState({ orientation: e.target.value, fullWidthContent: false, appKey: Math.random() })} >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div className="item"><input type="checkbox" checked={fetchMoreRecord} onChange={(e) => this.setState({ fetchMoreRecord: e.target.checked })} />Fetch more record</div>
          <div className="item"><input type="checkbox" checked={dynamicWidth} onChange={(e) => this.setState({ dynamicWidth: e.target.checked, fullWidthContent: false })} />Dynamic width of content</div>
          {orientation === 'vertical' ? <div className="item"><input type="checkbox" checked={fullWidthContent} onChange={(e) => this.setState({ fullWidthContent: e.target.checked, dynamicWidth: false })} />Full width of content</div> : null}
          <div className="item">Class name: <input type="text" placeholder="Enter class name" value={classNameList} onChange={(e) => this.setState({ classNameList: e.target.value })} /></div>
          <div className="item">Number rendered off screen: <input type="number" placeholder="Enter number" value={numberRenderedOffScreen} onChange={(e) => this.setState({ numberRenderedOffScreen: e.target.value, appKey: Math.random() })} /></div>
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
                return <div key={i} className={orientation === 'vertical' ? `box profile${fullWidthContent ? ' full-width' : ''}` : 'hbox profile'} style={{
                  width: dynamicWidth ? (200 + i) : null,
                  minWidth: dynamicWidth ? (200 + i) : null
                }}>
                  <img src={`https://randomuser.me/api/portraits/men/${i % 70}.jpg`} alt="demo profile" />
                  <div className="info">
                    <h4>{this.names[i % 55]}</h4>
                    <span>{this.desc[i % 55]}</span>
                    <a href="javascript:;">View More...</a>
                  </div>
                </div>
              })}
          </VirtualList>
        </div>

        {/* <div style={{ height: 400 }}>
          <VirtualList fetchMore={this.fetchMore} className="testclass">
            {this.state.recordList
              .map((d, i) => {
                return <div key={i} className="box">{d.name}</div>
              })}
          </VirtualList>
        </div> */}

        {/* <div>
          <VirtualList fetchMore={this.fetchMore} className="testclass" orientation='horizontal'>
            {this.state.recordList
              .map((d, i) => {
                return <div key={i} className="hbox">{d.name}</div>
              })}
          </VirtualList>
        </div> */}

      </div>
    );
  }
}

export default App;
