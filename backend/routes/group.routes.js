const Router = require("express").Router;
const { createGroup, getUserGroups, addMember, addExpense } = require("../controllers/group.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

const router = Router();

router.use(verifyJWT); // Apply auth to all group routes

router.route("/")
    .post(createGroup)
    .get(getUserGroups);

router.route("/:groupId/members").post(addMember);
router.route("/:groupId/expenses").post(addExpense);

module.exports = router;
