module.exports={
    mode:'development',
    entry: './lib/scripts/index.js',
    output:{
        filename:'../public/bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                exclude:/node_modules/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.js$/,
                exclude: /(node_modules|app.js|routes|test|jq)/,
                use: {
                    loader:"babel-loader"
                }
            }
        ]
    }
};
