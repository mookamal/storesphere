import os


def delete_migrations(project_dir):
    """
    Deletes all migration files in a Django project except for __init__.py.

    Args:
        project_dir (str): The path to the Django project directory.
    """
    for root, dirs, files in os.walk(project_dir):
        if 'migrations' in dirs:
            migrations_path = os.path.join(root, 'migrations')
            for file in os.listdir(migrations_path):
                file_path = os.path.join(migrations_path, file)
                # Keep only __init__.py
                if file != '__init__.py' and file.endswith('.py'):
                    os.remove(file_path)
                    print(f"Deleted: {file_path}")
            print(f"Cleaned: {migrations_path}")


# Provide the path to your Django project directory
project_directory = os.path.abspath("D:/projects/main-project/backend")

delete_migrations(project_directory)
