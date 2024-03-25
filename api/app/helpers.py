from werkzeug.datastructures import FileStorage


def allowed_file(file):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
    ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg"}

    # Check the file extension
    has_allowed_extension = (
        "." in file.filename
        and file.filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )

    # Check the content type
    has_allowed_content_type = file.content_type in ALLOWED_CONTENT_TYPES

    return has_allowed_extension and has_allowed_content_type


def validate_files(request):
    if "images[0]" not in request.files:
        return False, "No file part in the request"
    files = [
        v
        for k, v in request.files.items()
        if k.startswith("images") and isinstance(v, FileStorage)
    ]
    print(files)
    for file in files:

        if file.filename == "":
            return False, "No selected file"
        if not allowed_file(file):
            return False, "File type not allowed"
    return True, files
