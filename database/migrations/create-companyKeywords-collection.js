module.exports = (db) => {
    return db.createCollection("search_by_company_keywords", {
        capped: true,
        size: 300000,
        max: 1000,
    })
    .then(() => {
        return db.collection('search_by_company_keywords').createIndex({
            word: 1,
        });
    });
};
