import {MongoClient} from 'mongodb';
import 'dotenv/config'

const userName = process.env.USER_NAME;
const userPassword = process.env.USER_PASSWORD;

const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.zjyldhv.mongodb.net/UsersDb?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

export const addUserScore = async ({nickName, score, userId}) => {
    console.log(uri);
    try {
        const database = client.db('UsersDb');
        const usersTable = database.collection('Users');
        const result = await usersTable.insertOne({
            'nickName': nickName,
            'score': score,
            'userId': userId,
        });
        const users = await usersTable.find().toArray();
        const userResult = [];
        for (const user of users) {
            if (user.userId === userId || user.nickName === nickName) {
                userResult.push({
                    nickName: user.nickName,
                    score: user.score,
                })
            }
        }
        return userResult;

    } catch (e) {
        console.log('error', e);
        throw new Error(e.message);
    }
    finally {
        await client.close();
    }
}