module.exports = (db) => {
    return db.createCollection("company_keywords", {
        capped: true,
        size: 300000,
        max: 1000,
    })
    .then(() => {
        return db.collection('company_keywords').createIndex({
            word: 1,
        });
    });
};
