<div className="grid lg:grid-cols-3 gap-4">
<div className="lg:col-span-2">
  <div className="card p-3">
    <div>
      <div className="mb-2">
        <Label htmlFor="title" value="Title" />
      </div>
      <TextInput
        id="title"
        sizing="sm"
        type="text"
        {...register("title")}
        placeholder="Product 1"
        onBlur={handleBlur}
        required
      />
    </div>

    <div className="my-2">
      <div className="mb-2">
        <h2>Description</h2>
      </div>
      {/* CustomEditor with description */}
      <CustomEditor
        content={description}
        setContent={handleEditorChange}
      />
    </div>
    {/* Media */}
    <div className="my-2">
      <div className="mb-2">
        {selectedRemoveImages.length > 0 && (
          <div className="flex items-center justify-between">
            <h3>{selectedRemoveImages.length} file selected</h3>
            <Button
              color="red"
              size="xs"
              onClick={removeSelectedImages}
            >
              Remove
            </Button>
          </div>
        )}
        {selectedRemoveImages.length === 0 && <h2>Media</h2>}
      </div>
      {/* Media upload */}
      {selectedImages && (
        <div className="grid grid-rows-1 grid-flow-col gap-4 overflow-x-auto p-4">
          <div className="max-h-16 max-w-20 flex items-center justify-center">
            <Button
              size="xl"
              color="light"
              onClick={() => setOpenMediaModal(true)}
            >
              <IoCloudUploadOutline />
            </Button>
            <MediaModal
              openModal={openMediaModal}
              setOpenModal={() => setOpenMediaModal(false)}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
          </div>
          {selectedImages.map((image) => {
            return (
              <div
                key={image.id}
                className="flex items-center space-x-4"
              >
                {/* Checkbox for each image */}
                <Checkbox
                  id={image.id}
                  color="light"
                  onChange={(e) =>
                    handleSelectRemoveImages(image, e.target.checked)
                  }
                  checked={selectedRemoveImages.some(
                    (selectedImage) => selectedImage.id === image.id
                  )}
                />

                {/* Image display */}
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${image.image}`}
                  alt={`image-${image.id}`}
                  className="max-h-16 max-w-20 rounded-lg object-cover"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
</div>

<div className="lg:col-span-1">
  {/* Status */}
  <Status register={register} />
</div>

<div className="lg:col-span-1">
  <SeoInputs register={register} domain={domain} handle={handle} />
</div>
<div className="lg:col-span-1">
  <PriceInput
    register={register}
    currencyCode={storeData?.currencyCode}
    price={price}
    compare={compare}
  />
</div>
{/* start variants section */}
<div className="lg:col-span-2">
  <VariantInputs
    register={register}
    control={control}
    errors={errors}
    trigger={trigger}
    watch={watch}
    getValues={getValues}
  />
</div>
{/* end variants section */}
</div>
<Button
size="xl"
color="light"
type="submit"
className="fixed bottom-5 right-5 rounded-full shadow-md bg-baby-blue text-coal-600"
disabled={loading}
>
{loading && (
  <Spinner aria-label="Loading button" className="mr-1" size="md" />
)}
Add
</Button>