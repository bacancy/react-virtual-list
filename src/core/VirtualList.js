import React, { Component } from 'react';
import { isEqual, sumBy } from 'lodash';
import PropTypes from 'prop-types';

class VirtualList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalHeight: { offset: 0, client: 0 },
            totalWidth: 0,
            scrollPosition: 0,
            startPoint: 0,
            endPoint: 0,

            fetchingRecord: false,
            loadVirtualData: false,
            children: this.props.children,

            isVertical: this.props.orientation !== 'horizontal',
            displayLoading: false
        }

        this.containerHeight = 0;
        this.containerWidth = 0;
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
                fetchingRecord: false,
                displayLoading: false
            });
        }
    }

    // handle event when actual pane did mount
    paneDidMount(node) {
        if (node) {
            this.setState({
                totalHeight: {
                    offset: node.offsetHeight,
                    client: node.clientHeight
                }
            });
        }
    };

    // handle event when virtual pane did mount
    virtualPaneDidMount(node) {
        if (node) {
            const { scrollPosition, isVertical } = this.state;
            this.containerHeight = node.offsetHeight;
            this.containerWidth = node.offsetWidth;
            this.setState(this.getRecordScale(scrollPosition));

            if (scrollPosition !== 0) {
                const x = isVertical ? 0 : scrollPosition;
                const y = isVertical ? scrollPosition : 0;
                node.scrollTo(x, y);
            }
            node.addEventListener('scroll', (e) => {
                const scroll = e.srcElement[isVertical ? 'scrollTop' : 'scrollLeft'];
                if (this.callServerAPI(scroll) && this.props.fetchMore) {
                    this.setState({ fetchingRecord: true }, () => {
                        this.props.fetchMore();
                    });
                }
                if (this.displayAPILoading(scroll) && this.props.fetchMore) {
                    this.setState({ displayLoading: true });
                }
                const scale = this.getRecordScale(scroll);
                this.setState({
                    scrollPosition: scroll,
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
                let obj = { loadVirtualData: true };
                if (!this.state.isVertical) {
                    const lastChild = this.childrenData[this.childrenData.length - 1];
                    const totalWidth = lastChild.recordLeft + lastChild.recordWidth; //sumBy(this.childrenData, function (d) { return d.recordWidth; });
                    obj.totalWidth = totalWidth;
                }
                this.setState(obj);
            }
        }
    }

    // return true if server API call is required by end of record list
    callServerAPI(scroll) {
        const { totalHeight, fetchingRecord, isVertical, totalWidth } = this.state;
        if (isVertical) {
            if (this.childrenData.length === 0 || totalHeight.offset === 0) return false;
            // return (scroll >= (totalHeight.offset - this.containerHeight - 10)) && !fetchingRecord;
            return (scroll >= this.childrenData[this.childrenData.length - this.props.numberRenderedOffScreen].recordTop - this.containerHeight) && !fetchingRecord;
        }
        else {
            if (this.childrenData.length === 0 || totalWidth === 0) return false;
            // return (scroll >= (totalWidth - this.containerWidth - 10)) && !fetchingRecord;
            return (scroll >= this.childrenData[this.childrenData.length - this.props.numberRenderedOffScreen].recordLeft - this.containerWidth) && !fetchingRecord;
        }
    }

    // return true if server API call is required by end of record list
    displayAPILoading(scroll) {
        const { totalHeight, displayLoading, isVertical, totalWidth } = this.state;
        if (isVertical) {
            if (this.childrenData.length === 0 || totalHeight.offset === 0) return false;
            return (scroll >= (totalHeight.offset - this.containerHeight - 10)) && !displayLoading;
        }
        else {
            if (this.childrenData.length === 0 || totalWidth === 0) return false;
            return (scroll >= (totalWidth - this.containerWidth - 10)) && !displayLoading;
        }
    }

    // return start and end points to display records
    getRecordScale(scroll) {
        const { isVertical } = this.state;

        let upperList = this.childrenData
            .filter(x => ((isVertical ? x.recordTop : x.recordLeft) + (isVertical ? x.recordHeight : x.recordWidth)) <= scroll)
            .slice(-(this.props.numberRenderedOffScreen));
        let upperScroll = upperList && upperList.length > 0 ? upperList[0][isVertical ? 'recordTop' : 'recordLeft'] : 0;

        let lowerList = this.childrenData
            .filter(x => (isVertical ? x.recordTop : x.recordLeft) >= (scroll + (isVertical ? this.containerHeight : this.containerWidth)))
            .slice(0, this.props.numberRenderedOffScreen);
        let lowerScroll = lowerList && lowerList.length > 0 ?
            lowerList[lowerList.length - 1][isVertical ? 'recordTop' : 'recordLeft'] :
            (this.childrenData[this.childrenData.length - 1] ?
                this.childrenData[this.childrenData.length - 1][isVertical ? 'recordTop' : 'recordLeft'] : 0);

        return {
            startPoint: upperScroll,
            endPoint: lowerScroll
        };
    }

    // render child node
    renderChild() {
        return React.Children.map(this.state.children, (child) => {
            const id = Math.random();
            var style = { ...child.props.style, whiteSpace: 'normal' };
            return React.cloneElement(child, {
                id: id,
                style,
                ref: ($event) => this.nodeDidMount($event, child, id)
            });
        });
    }

    // render child node virtually
    renderVirtualChild() {
        const { startPoint, endPoint, isVertical } = this.state;
        return this.childrenData.map((d, i) => {
            if ((d[isVertical ? 'recordTop' : 'recordLeft']) >= startPoint && d[isVertical ? 'recordTop' : 'recordLeft'] <= endPoint) {
                return React.cloneElement(d.node, {
                    key: i,
                    id: d.id,
                    style: {
                        ...d.node.props.style,
                        position: 'absolute',
                        top: d.recordTop,
                        left: d.recordLeft,
                        height: d.recordHeight,
                        minHeight: d.recordHeight,
                        width: d.recordWidth,
                        minWidth: d.recordWidth,
                        margin: 0,
                        whiteSpace: 'normal'
                    }
                });
            }
            else return null;
        })
    }

    render() {
        const { children, displayLoading, totalHeight, totalWidth, loadVirtualData, isVertical } = this.state;

        return (
            <div className={`virtual-list ${this.props.className}`}>
                {children && children.length > 0 ? <React.Fragment>
                    {!loadVirtualData ?
                        <div className="list-outer" style={{ position: isVertical ? 'absolute' : 'relative' }}>
                            <div className={isVertical ? 'list-vertical' : 'list-horizontal'} style={{ overflow: 'hidden !important' }} ref={this.paneDidMount}>
                                {this.renderChild()}
                            </div>
                        </div> :
                        <div className="list-outer" ref={this.virtualPaneDidMount} style={{ height: isVertical ? 'auto' : totalHeight.offset, overflowY: isVertical ? 'auto' : 'hidden' }}>
                            <div className={isVertical ? 'list-vertical' : 'list-horizontal'} style={{ height: totalHeight.client, width: isVertical ? 'auto' : totalWidth }}>
                                {this.renderVirtualChild()}
                            </div>
                        </div>}
                </React.Fragment> : null}
                {displayLoading ? <div className="loading-box" style={{ height: isVertical ? '100%' : totalHeight.client }}>Loading...</div>
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
