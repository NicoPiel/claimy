use spacetimedb::{Identity, ReducerContext, reducer, table};

#[table(name = user, public)]
pub struct User {
    #[primary_key]
    id: Identity,
    username: Option<String>,
    password: Option<String>,
    role: Option<String>,
}

#[reducer]
/// Clients invoke this to set their user names.
pub fn set_name(ctx: &ReducerContext, username: String) -> Result<(), String> {
    if let Some(user) = ctx.db.user().id().find(ctx.sender) {
        ctx.db.user().id().update(User {
            username: Some(username),
            ..user
        });
        Ok(())
    } else {
        Err("Could not set name for unknown user".to_string())
    }
}
