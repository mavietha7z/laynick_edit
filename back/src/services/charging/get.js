import { Charging } from '~/models/charging';

const serviceTotalChargings = async (objectSearch = {}) => {
    let declared_value = 0;
    let value = 0;
    let amount = 0;

    const result = await Charging.find(objectSearch).select('declared_value value amount');

    for (let i = 0; i < result.length; i++) {
        declared_value += result[i].declared_value;
        value += result[i].value;
        amount += result[i].amount;
    }

    return {
        value,
        amount,
        declared_value,
    };
};

export default serviceTotalChargings;
