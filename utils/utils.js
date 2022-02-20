const checkQueryResult=(res)=>{
    if (res && res.rows.length>0){
        return res.rows;
    }
    else{
        return [];
    }
};
export {checkQueryResult};