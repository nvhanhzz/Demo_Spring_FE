import React, { useEffect } from 'react';
import { notification } from 'antd';
import { removeAlert } from '../../redux/actions/alert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';

const AlertContainer: React.FC = () => {
    const dispatch = useDispatch();
    const alerts = useSelector((state: RootState) => state.alert.alerts);

    useEffect(() => {
        notification.destroy();

        alerts.forEach((alertsData: { message: string; description: string; duration: number; }, index: number) => {
            notification.open({
                message: alertsData.message,
                description: alertsData.description,
                duration: alertsData.duration,
                onClose: () => dispatch(removeAlert(index)),
            });
        });
    }, [alerts, dispatch]);

    return null;
};

export default AlertContainer;