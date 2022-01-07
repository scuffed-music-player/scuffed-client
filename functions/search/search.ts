import { Handler } from "@netlify/functions";
import { youtube } from "scrape-youtube";
import { ISongData } from "../../src/state/player";

export const handler: Handler = async (event) => {
    try {
        const query = event.queryStringParameters.query.toLowerCase().trim();

        const searchResults = await youtube.search(query);
        const target = searchResults.videos[0];

        const final: ISongData = {
            id: target.id,
            title: target.title,
            thumbnail: target.thumbnail
        };

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                song: final
            })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Lol idk something didnt work search something else?"
            })
        };
    }
};