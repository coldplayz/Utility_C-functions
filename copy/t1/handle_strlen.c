#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "main.h"


/**
 * handle_strlen - adds one to string len
 * calculations to leave room for the null character.
 * @str: the string whose length to calculate.
 * @len: the integer to add the calculated length to.
 * @i: an int representing an index.
 * @n: an int representing the number of strings to concat.
 *
 * Description: this function is tailored as a helper for functions, as in
 * variadic string concatenation functions, where a number of strings are
 * joined together to form one whole string. The length to be used in
 * reallocating memory space (len) to accomodate the new string needs to
 * take into account the extra byte needed for the null character if 'str' is
 * the last string in the
 * variable argument list (as indicated by the comparison between i and n).
 * Return: the updated value of len.
 */
size_t handle_strlen(char *str, size_t len, int i, int n)
{
	if (i == (n - 1))
	{
		len += (str != NULL) ? (_strlen(str) + 1) : 1;
	}
	else
	{
		len += (str != NULL) ? (_strlen(str)) : 0;
	}

	return (len);
}
