import React, { Component } from 'react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';

class VirtualList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalHeight: 0,
            scrollHeight: 0,
            startPoint: 0,
            endPoint: 0,

            fetchingRecord: false,
            loadVirtualData: false,
            children: this.props.children
        }

        this.containerHeight = 0;
        this.childrenData = [];

        this.paneDidMount = this.paneDidMount.bind(this);
        this.virtualPaneDidMount = this.virtualPaneDidMount.bind(this);
        this.nodeDidMount = this.nodeDidMount.bind(this);
    }

    // create resize event listener
    componentDidMount() {
        window.addEventListener("resize", () => {
            this.childrenData = [];
            this.setState({ loadVirtualData: false });
        });
    }

    // remove resize event listener
    componentWillUnmount() {
        window.removeEventListener("resize", () => {
            console.log('removed resize event listener');
        });
    }

    // track new upcoming props
    componentWillReceiveProps(nextProps) {
        const currentProps = this.props.children ? this.props.children.map(x => x.props) : null;
        const newProps = nextProps.children ? nextProps.children.map(x => x.props) : null;
        if (!isEqual(currentProps, newProps)) {
            this.childrenData = [];
            this.setState({
                children: nextProps.children,
                loadVirtualData: false,
                fetchingRecord: false
            });
        }
    }

    // handle event when actual pane did mount
    paneDidMount(node) {
        if (node) {
            this.setState({ totalHeight: node.offsetHeight });
        }
    };

    // handle event when virtual pane did mount
    virtualPaneDidMount(node) {
        if (node) {
            const { scrollHeight } = this.state;
            this.containerHeight = node.offsetHeight;
            this.setState(this.getRecordScale(scrollHeight));

            if (scrollHeight !== 0) {
                node.scrollTo(0, scrollHeight);
            }
            node.addEventListener('scroll', (e) => {
                const scroll = e.srcElement.scrollTop;
                if (this.callServerAPI(scroll) && this.props.fetchMore) {
                    this.setState({ fetchingRecord: true }, () => {
                        this.props.fetchMore();
                    });
                }
                const scale = this.getRecordScale(scroll);
                this.setState({
                    scrollHeight: scroll,
                    startPoint: scale.startPoint,
                    endPoint: scale.endPoint
                });
            });
        }
    };

    // handle event when actual node did mount
    nodeDidMount(node, child, id) {
        if (node) {
            this.childrenData.push({
                node: child,
                id: id,
                recordHeight: node.offsetHeight,
                recordWidth: node.offsetWidth,
                recordTop: node.offsetTop,
                recordLeft: node.offsetLeft
            });
            if (this.childrenData.length === this.state.children.length) {
                this.setState({ loadVirtualData: true });
            }
        }
    }

    // return true if server API call is required by end of record list
    callServerAPI(scroll) {
        const { totalHeight, fetchingRecord } = this.state;
        if (this.childrenData.length === 0 || totalHeight === 0) return false;
        return (scroll >= (totalHeight - this.containerHeight - 10)) && !fetchingRecord;
    }

    // return start and end points to display records
    getRecordScale(scroll) {
        let upperList = this.childrenData
            .filter(x => (x.recordTop + x.recordHeight) <= scroll)
            .slice(-(this.props.numberRenderedOffScreen));
        let upperScroll = upperList && upperList.length > 0 ? upperList[0].recordTop : 0;

        let lowerList = this.childrenData
            .filter(x => x.recordTop >= (scroll + this.containerHeight))
            .slice(0, this.props.numberRenderedOffScreen);
        let lowerScroll = lowerList && lowerList.length > 0 ?
            lowerList[lowerList.length - 1].recordTop :
            (this.childrenData[this.childrenData.length - 1] ?
                this.childrenData[this.childrenData.length - 1].recordTop : 0);

        return {
            startPoint: upperScroll,
            endPoint: lowerScroll
        };
    }

    // render child node
    renderChild() {
        return React.Children.map(this.state.children, (child) => {
            const id = Math.random();
            return React.cloneElement(child, {
                id: id,
                ref: ($event) => this.nodeDidMount($event, child, id)
            });
        });
    }

    // render child node virtually
    renderVirtualChild() {
        const { startPoint, endPoint } = this.state;
        return this.childrenData.map((d, i) => {
            if (d.recordTop >= startPoint && d.recordTop <= endPoint) {
                return React.cloneElement(d.node, {
                    key: i,
                    id: d.id,
                    style: {
                        position: 'absolute',
                        top: d.recordTop,
                        left: d.recordLeft,
                        height: d.recordHeight,
                        width: d.recordWidth
                    }
                });
            }
            else return null;
        })
    }

    render() {
        const { children, fetchingRecord, totalHeight, loadVirtualData } = this.state;

        return (
            <div className={`virtual-list ${this.props.className}`}>
                {children && children.length > 0 ? <React.Fragment>
                    {!loadVirtualData ?
                        <div className="list-outer">
                            <div style={{ overflow: 'hidden' }} ref={this.paneDidMount}>
                                {this.renderChild()}
                            </div>
                        </div> :
                        <div className="list-outer" ref={this.virtualPaneDidMount}>
                            <div style={{ height: totalHeight, overflow: 'hidden' }}>
                                {this.renderVirtualChild()}
                            </div>
                        </div>}
                </React.Fragment> : null}
                {fetchingRecord ? <div className="loading-box">Loading...</div>
                    : null}
            </div>
        );
    }
}

VirtualList.propTypes = {
    fetchMore: PropTypes.func,
    numberRenderedOffScreen: PropTypes.number,
    className: PropTypes.string,
    orientation: PropTypes.string
}

VirtualList.defaultProps = {
    fetchMore: null,
    numberRenderedOffScreen: 5,
    className: '',
    orientation: 'vertical'
}

export default VirtualList;
