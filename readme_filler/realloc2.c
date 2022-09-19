#include "main.h"
#include <stdlib.h>

/**
 * _realloc -  reallocates a memory block using malloc and free
 * @ptr: pointer to the memory previously allocated with a call to malloc
 * @old_size: the size, in bytes, of the allocated space for ptr
 * @new_size: the new size, in bytes of the new memory block
 *
 * Return: a pointer, ptr, to the reallocated memory block
 */
void *_realloc(void *ptr, unsigned int old_size, unsigned int new_size)
{
	void *ptr2;

	if (new_size == old_size)
	{
		return (ptr);
	}
	else if ((new_size == 0) && (ptr != NULL))
	{
		free(ptr);
		return (NULL);
	}
	if (ptr == NULL)
	{
		ptr = malloc(new_size);
		if (ptr == NULL)
		{
			return (NULL);
		}
		else
		{
			return (ptr);
		}
	}
	ptr2 = malloc(new_size);
	if (ptr2 == NULL)
	{
		return (NULL);
	}
	if (new_size < old_size)
	{
		_memncpy(ptr2, ptr, (new_size));
	}
	else
	{
		_memncpy(ptr2, ptr, (old_size));
	}
	free(ptr);
	return (ptr2);
}
