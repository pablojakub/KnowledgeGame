import {MongoClient} from 'mongodb';
import 'dotenv/config'

const uri = process.env.MONGO_URI;
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
        console.log('error', e.message);
        console.log('error', e);
        throw new Error(e.message);
    }
    finally {
        await client.close();
    }
}