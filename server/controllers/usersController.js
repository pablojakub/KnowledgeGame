import {MongoClient} from 'mongodb';

const uri = 'mongodb+srv://pablo_jakub:Warta1992@cluster0.zjyldhv.mongodb.net/UsersDb?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export const getAllUsers = async () => {
    try {
        const database = client.db('UsersDb');
        const usersTable = database.collection('Users');
        const users = await usersTable.find();
        const userResult = [];
        for await (const user of users) {
            userResult.push({
                nickName: user.nickName,
                score: user.score,
            })
        }
        return userResult;
    } finally {
        await client.close();
    }
};

export const addUserScore = async ({nickName, score}) => {
    try {
        const database = client.db('UsersDb');
        const usersTable = database.collection('Users');
        const result = await usersTable.insertOne({
            "nickName": nickName,
            "score": score,
        });
    } finally {
        await client.close();
    }
}