const API_KEY ='Gcjdu6kVb0Ow4piKHS3rvujXRqL9evriiHYc5odr';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

export const searchFood = async(query) => {

    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();

    return data.foods;
}




