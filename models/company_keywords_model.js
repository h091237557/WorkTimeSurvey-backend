
class CompanyKeyWordsModel {

    constructor(db) {
        this.collection = db.collection('search_by_company_keywords');
    }
    createKeyword(word) {
        return this.collection.insert({word});
    }
}

module.exports = CompanyKeyWordsModel;
