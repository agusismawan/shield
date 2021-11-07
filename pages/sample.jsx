import DatePicker from 'antd/lib/date-picker';
import 'antd/dist/antd.css';

export default function Sample() {
    return (
        <div style={{ width: 500, margin: '100px auto' }}>
            <DatePicker
                className="text-xl"
            />
        </div>
    );
};