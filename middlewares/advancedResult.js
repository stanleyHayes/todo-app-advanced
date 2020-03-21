const advancedResults = function (model, populate) {
    return async function(req, res, next){
        let query;
        const DEFAULT_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 10;

        //make copy of query
        let requestQuery = {...req.query};

        //fields to remove from query params to enable filtering, select fields, limit
        const fieldsToRemove = ['select', 'sort', 'limit', 'page'];

        fieldsToRemove.forEach(function (param) {
            return delete requestQuery[param];
        });


        //Create query string
        let queryString = JSON.stringify(requestQuery);


        //create operators
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, function (match) {
            return `$${match}`
        });

        //executing query
        query = model.find(JSON.parse(queryString));

        //select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(" ");
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        //pagination
        const page = parseInt(req.query.page, 10) || DEFAULT_PAGE;
        const limit = parseInt(req.query.limit, 10) || DEFAULT_PAGE_SIZE;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalDocuments = await model.countDocuments();

        query = query.skip(startIndex).limit(limit);

        if(populate){
            query = query.populate(populate);
        }
        const results = await query;

        let pagination = {};

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        if (endIndex < totalDocuments) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        res.advancedResults = {
            success: true,
            count: results.length,
            data: results
        };

        next();
    }
};

module.exports = advancedResults;
