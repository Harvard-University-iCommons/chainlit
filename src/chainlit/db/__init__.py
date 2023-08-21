import os

from chainlit.config import PACKAGE_ROOT, config, config_dir
from chainlit.logger import logger

if os.environ.get("SCHEMA_PATH"):
    SCHEMA_PATH = os.environ.get("SCHEMA_PATH")
    logger.info(f"loading prisma schema from SCHEMA_PATH env var: {SCHEMA_PATH}")
elif os.path.isfile(os.path.join(config_dir, "schema.prisma")):
    SCHEMA_PATH = os.path.join(config_dir, "schema.prisma")
    logger.info(f"loading prisma schema from the .chainlit config dir: {SCHEMA_PATH}")
else:
    SCHEMA_PATH = os.path.join(PACKAGE_ROOT, "db/prisma/schema.prisma")
    logger.info(
        f"loading the default prisma schema from the chainlit package: {SCHEMA_PATH}"
    )

POSTGRES_SCHEMA_PATH = os.path.join(
    PACKAGE_ROOT, "client/postgres/prisma/schema.prisma"
)


def local_db_push():
    from importlib import reload

    import prisma
    from prisma.cli.prisma import run

    args = ["db", "push", f"--schema={SCHEMA_PATH}"]
    env = {"LOCAL_DB_PATH": os.environ.get("LOCAL_DB_PATH")}
    run(args, env=env)

    # Without this the client will fail to initialize the first time.
    reload(prisma)


def init_local_db():
    use_local_db = config.project.database in ["local", "custom"]
    if use_local_db:
        if not os.path.exists(config.project.local_db_path):
            local_db_push()


def migrate_local_db():
    use_local_db = config.project.database in ["local", "custom"]
    if use_local_db:
        if os.path.exists(config.project.local_db_path):
            local_db_push()
            logger.info(f"Local db migrated")
        else:
            logger.info(f"Local db does not exist, skipping migration")
    else:
        logger.info(f"Database setting must be set to 'local' to migrate local db")


def postgres_db_push():
    from importlib import reload

    import chainlit.client.postgres.prisma.app
    from chainlit.client.postgres.prisma.app.cli.prisma import run

    args = ["db", "push", f"--schema={POSTGRES_SCHEMA_PATH}"]
    env = {"POSTGRES_DATABASE_URL": os.environ.get("POSTGRES_DATABASE_URL")}
    run(args, env=env)

    # Similar initialization than local_db_push
    reload(chainlit.client.postgres.prisma.app)


def migrate_postgres_db():
    use_postgres_db = config.project.database == "postgres"
    if use_postgres_db:
        postgres_db_push()
        logger.info(f"Postgres db migrated")
    else:
        logger.info(f"Database setting must be set to 'local' to migrate local db")
