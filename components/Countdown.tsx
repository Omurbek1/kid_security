import React from 'react';
import { Text, AppState } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { sprintf } from 'sprintf-js';

const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];

class Countdown extends React.Component {
    static propTypes = {
        id: PropTypes.number,
        timeToShow: PropTypes.array,
        until: PropTypes.number,
        onFinish: PropTypes.func,
        style: PropTypes.object,
    };

    state = {
        until: Math.max(this.props.until, 0),
        lastUntil: null,
        wentBackgroundAt: null,
    };

    constructor(props) {
        super(props);
        this.timer = setInterval(this.updateTimer, 1000);
    };

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    };

    componentWillUnmount() {
        clearInterval(this.timer);
        AppState.removeEventListener('change', this._handleAppStateChange);
    };

    componentDidUpdate(prevProps, prevState) {
        const { until, id } = this.props;
        if (until !== prevProps.until || id !== prevProps.id) {
            this.setState({
                lastUntil: prevState.until,
                until: Math.max(prevProps.until, 0),
            });
        };
    };

    _handleAppStateChange = currentAppState => {
        const { until, wentBackgroundAt } = this.state;

        if (currentAppState === 'active' && wentBackgroundAt && this.props.running) {
            const diff = (Date.now() - wentBackgroundAt) / 1000.0;

            this.setState({
                lastUntil: until,
                until: Math.max(0, until - diff),
            });
        };

        if (currentAppState === 'background') {
            this.setState({ wentBackgroundAt: Date.now() });
        };
    };

    getTimeLeft = () => {
        const { until } = this.state;

        return {
            seconds: until % 60,
            minutes: parseInt(until / 60, 10) % 60,
            hours: parseInt(until / (60 * 60), 10) % 24,
            days: parseInt(until / (60 * 60 * 24), 10),
        };
    };

    updateTimer = () => {
        const { lastUntil, until } = this.state;
        const { running, onFinish } = this.props;

        if (lastUntil === until || !running) {
            return;
        };

        if (until === 1 || (until === 0 && lastUntil !== 1)) {
            if (onFinish) {
                onFinish();
            };
        };

        if (until === 0) {
            this.setState({ lastUntil: 0, until: 0 });
        } else {
            this.setState({
                lastUntil: until,
                until: Math.max(0, until - 1),
            });
        };
    };

    render() {
        const { timeToShow, style } = this.props;
        const { days, hours, minutes, seconds } = this.getTimeLeft();
        const newTime = sprintf('%02d:%02d:%02d:%02d', days, hours, minutes, seconds).split(':');

        return <Text style={style}>
            {timeToShow.includes('D') ? newTime[0] : null}
            {timeToShow.includes('D') && timeToShow.includes('H') ? ':' : null}
            {timeToShow.includes('H') ? newTime[1] : null}
            {timeToShow.includes('H') && timeToShow.includes('M') ? ':' : null}
            {timeToShow.includes('M') ? newTime[2] : null}
            {timeToShow.includes('M') && timeToShow.includes('S') ? ':' : null}
            {timeToShow.includes('S') ? newTime[3] : null}
        </Text>
    };
};

Countdown.defaultProps = {
    timeToShow: DEFAULT_TIME_TO_SHOW,
    until: 0,
    running: true,
};

export default Countdown;
