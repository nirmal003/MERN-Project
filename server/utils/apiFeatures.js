class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing some field for Category
    const removeFeild = ["keyword", "page", "limit"];
    removeFeild.forEach((key) => delete queryCopy[key]);

    // Filter for Price and Rating

    const modifiedPrice = {};
    for (const key in queryCopy.price)
      modifiedPrice[`$${key}`] = queryCopy.price[key];

    const modifiedQuery = { ...queryCopy, price: modifiedPrice };

    // const queryStr = JSON.stringify(queryCopy);
    // queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    // this.query = this.query.find(JSON.parse(queryStr));

    this.query = this.query.find(modifiedQuery);

    return this;
  }
}

module.exports = ApiFeatures;
