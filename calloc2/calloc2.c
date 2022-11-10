#include <stdio.h>
#include <stdlib.h>


/**
 * calloc2 - allocates and initializes memory of @size bytes.
 * @size: the number of contiguous bytes to allocate.
 *
 * Note: bytes are currently initialized to zero.
 * Return: a void pointer representing the address of the allocated space.
 */
void *calloc2(size_t size)
{
	void *ptr;
	char *ptc;
	size_t i;

	ptr = malloc(size);
	if (!ptr)
	{
		perror("calloc2");
		return (NULL);
	}

	ptc = (char *)ptr;
	for (i = 0; i < size; i++)
	{
		ptc[i] = 0;
	}

	return (ptr);
}
