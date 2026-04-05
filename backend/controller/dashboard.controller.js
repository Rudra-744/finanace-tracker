import Record from "../models/Record.js";

export const getDashboardStats = async (req, res) => {
    try {
        const summary = await Record.aggregate([
            {
                $group:{
                    _id:"$type",
                    totalAmount:{$sum:"$amount"},
                    count:{$sum:1}
                }
            }
        ])

        let totalIncome = 0;
        let totalExpense = 0;


        summary.forEach(item => {
            if(item._id === "income"){
                totalIncome = item.totalAmount;
            }else{
                totalExpense = item.totalAmount;
            }
        })

        const netBalance = totalIncome - totalExpense;

        res.status(200).json({
            message:"Dashboard stats fetched successfully",
            stats:{
                totalIncome,
                totalExpense,
                netBalance
            }
        })
    } catch (error) {
        console.log("Error in getDashboardStats",error);
        res.status(500).json({ message: "Error fetching dashboard summary" });
    }
}