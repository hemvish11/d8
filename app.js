require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");
const _=require("lodash");

const app=express();

// we can push items to const array but cannot assign other array to this one

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_DB);

const itemSchema=new mongoose.Schema({
    name:String
});

const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name:"Hii..."
});
const item2=new Item({
    name:"Bro..."
});
const item3=new Item({
    name:"Kaise ho..."
});

const defaultItems=[item1,item2,item3];

let currDay;
app.get("/",function(req,res){
    
    const day=date.getDate();
    currDay=day;
    
    Item.find({})
        .then(foundItems=>{
            if(foundItems.length===0){
                Item.insertMany(defaultItems)
                    .then(result=>{
                        console.log("Added");
                    })
                    .catch(err1=>{
                        console.log(err1);
                    });
            }
            res.render("list",{
                title:day,
                addNewItems:foundItems
            });
        })
        .catch(err=>{
            console.log(err);
        })
    
});
// add item in their corresponding list on the basis of their title name
app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listTitle=req.body.title;
    
    const item=new Item({
        name:itemName
    });

    if(listTitle===currDay){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listTitle})
        .then(foundList=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listTitle);
        })
        .catch(err=>{
            console.log(err);
        });
    }
    
});

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName===currDay){
        Item.deleteOne({_id:checkedItemId})
        .then(result=>{
            console.log("Deleted");
        })
        .catch(err=>{
            console.log(err);
        })
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
        .then(result=>{
            console.log("deleted");
            res.redirect("/"+listName);
        })
        .catch(err=>{
            console.log(err);
        });
    }
});

const listSchema={
    name:String,
    items:[itemSchema]
};
const List=mongoose.model("List",listSchema);



// dynamic lists
app.get("/:dynamicListName",function(req,res){
    const dynamicListName= _.capitalize(req.params.dynamicListName);

    List.findOne({name:dynamicListName})
    .then(foundList=>{
        if(!foundList){
            const list=new List({
                name:dynamicListName,
                items:defaultItems
            });
            list.save();
            res.redirect("/"+dynamicListName);
        }else{
            res.render("list",{
                title:foundList.name,
                addNewItems:foundList.items
            });
        }        
    })
    .catch(err=>{
        console.log(err);
    })
});



app.get("/about",function(req,res){
    res.render("about");
});

app.listen(process.env.PORT,function(){
    console.log("Server chalu, jao dhoom machao");
});
