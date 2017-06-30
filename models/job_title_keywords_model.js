
class JobTitleKeyWordsModel {

    constructor(db) {
        this.collection = db.collection('search_by_job_title_keywords');
    }
    createKeyword(word) {
        return this.collection.insert({word});
    }
}

module.exports = JobTitleKeyWordsModel;
